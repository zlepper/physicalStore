package main

import (
	"github.com/labstack/echo"
	"io"
	"net/http"
	"os"
	"path"
	"strings"
)

type PostDataStore interface {
	// Creates a new post on the given list
	CreatePost(name, listId, owner string) (Post, error)
	// Deletes a specific post on the given list
	DeletePost(postId, listId, owner string) error
	// Gets the specific list
	GetList(id string) (PostList, error)
	// Updates the given post
	UpdatePost(post Post, listId, updator string) error
	// Creates a new attachment on the given post
	CreateAttachment(postId, listId, uploaded, fileName string, isImage bool) (Attachment, error)
}

func BindPostHandler(group *echo.Group, store PostDataStore) {
	handler := &PostHandler{store: store}

	group.POST("/", handler.CreatePost)
	group.DELETE("/:postId", handler.DeletePost)
	group.PUT("/:postId", handler.UpdatePost)
	group.POST("/:postId/attach", handler.AttachFile)
}

type PostHandler struct {
	store PostDataStore
}

type CreatePostRequest struct {
	Name string `json:"name"`
}

func (p *PostHandler) CreatePost(c echo.Context) error {
	subject, ok := c.Get("user").(*SubjectData)
	if !ok {
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [CreatePost] could not convert user data to subject"})
	}

	listId := c.Param("listId")
	if listId == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [CreatePost] list id was empty"})
	}

	var request CreatePostRequest
	err := c.Bind(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [CreatePost] invalid request"})
	}

	post, err := p.store.CreatePost(request.Name, listId, subject.Username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, JsonError{err.Error()})
	}

	return c.JSON(http.StatusCreated, post)
}

func (p *PostHandler) DeletePost(c echo.Context) error {
	subject, ok := c.Get("user").(*SubjectData)
	if !ok {
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [DeletePost] could not convert user data to subject"})
	}

	postId := c.Param("postId")
	if postId == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [DeletePost] post id was empty"})
	}

	listId := c.Param("listId")
	if listId == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [DeletePost] list id was empty"})
	}

	postList, err := p.store.GetList(listId)
	if err != nil {
		return c.JSON(http.StatusNotFound, JsonError{err.Error()})
	}

	if postList.IsEditor(subject.Username) {
		for _, post := range postList.Posts {
			if post.Id == postId {
				go cleanupForPost(post)
				break
			}
		}
	}

	err = p.store.DeletePost(postId, listId, subject.Username)
	if err != nil {
		return c.JSON(http.StatusBadRequest, JsonError{err.Error()})
	}

	return c.JSON(http.StatusOK, struct{}{})
}

func cleanupForPost(post Post) {
	for _, attachment := range post.Attachments {
		os.Remove(attachmentDir + attachment.Filename)
		if attachment.IsImage {
			os.Remove(attachmentDir + attachment.Filename + ".thumb")
		}
	}
}

func (p *PostHandler) UpdatePost(c echo.Context) error {
	subject, ok := c.Get("user").(*SubjectData)
	if !ok {
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [UpdatePost] could not convert user data to subject"})
	}

	postId := c.Param("postId")
	if postId == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [UpdatePost] post id was empty"})
	}

	listId := c.Param("listId")
	if listId == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [UpdatePost] list id was empty"})
	}

	var request Post
	err := c.Bind(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, JsonError{err.Error()})
	}

	if request.Id != postId {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [UpdatePost] post id and request post id did not match"})
	}

	err = p.store.UpdatePost(request, listId, subject.Username)
	if err != nil {
		return c.JSON(http.StatusBadRequest, JsonError{err.Error()})
	}

	return c.JSON(http.StatusOK, struct{}{})
}

func (p *PostHandler) AttachFile(c echo.Context) error {
	subject, ok := c.Get("user").(*SubjectData)
	if !ok {
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [AttachFile] could not convert user data to subject"})
	}

	postId := c.Param("postId")
	if postId == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [AttachFile] post id was empty"})
	}

	listId := c.Param("listId")
	if listId == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [AttachFile] list id was empty"})
	}

	if postId != c.FormValue("postId") {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [AttachFile] post id didn't match"})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, JsonError{err.Error()})
	}

	extension := path.Ext(file.Filename)

	newFileName := generateId() + extension

	outputFilePath := path.Join(attachmentDir, newFileName)

	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, JsonError{err.Error()})
	}
	output, err := os.OpenFile(outputFilePath, os.O_CREATE|os.O_WRONLY, os.ModePerm)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, JsonError{err.Error()})
	}
	defer output.Close()

	_, err = io.Copy(output, src)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, JsonError{err.Error()})
	}

	contentType, err := getContentType(outputFilePath)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, JsonError{err.Error()})
	}

	isImage := strings.HasPrefix(contentType, "image/")

	if isImage {
		createThumbnail(outputFilePath)
	}

	attachment, err := p.store.CreateAttachment(postId, listId, subject.Username, newFileName, isImage)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, JsonError{err.Error()})
	}

	return c.JSON(http.StatusOK, attachment)
}

func getContentType(filename string) (string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return "", err
	}
	defer file.Close()

	data := make([]byte, 512)

	_, err = file.Read(data)
	if err != nil {
		return "", err
	}

	contentType := http.DetectContentType(data)

	return contentType, nil
}
