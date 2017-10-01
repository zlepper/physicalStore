package main

import (
	"github.com/labstack/echo"
	"net/http"
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
}

func BindPostHandler(group *echo.Group, store PostDataStore) {
	handler := &PostHandler{store: store}

	group.POST("/", handler.CreatePost)
	group.DELETE("/:postId", handler.DeletePost)
	group.PUT("/:postId", handler.UpdatePost)
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

	err := p.store.DeletePost(postId, listId, subject.Username)
	if err != nil {
		return c.JSON(http.StatusBadRequest, JsonError{err.Error()})
	}

	return c.JSON(http.StatusOK, struct{}{})
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
