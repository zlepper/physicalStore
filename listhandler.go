package main

import (
	"github.com/labstack/echo"
	"net/http"
)

type ListDataStore interface {
	// Adds a new list to the store
	AddList(list PostList) (newList PostList, err error)
	// Gets all the lists the user can access
	GetAllList(accessor string) (lists []PostList, err error)
	// Gets the specific list
	GetList(id string) (PostList, error)
}

func BindListHandler(listGroup *echo.Group, store ListDataStore) error {
	listHandler := &ListHandler{store: store}

	listGroup.GET("/", listHandler.GetAllLists)
	listGroup.GET("/:listId", listHandler.GetListContent)
	listGroup.POST("/", listHandler.CreateList)

	return nil
}

type ListHandler struct {
	store ListDataStore
}

type CreateListRequest struct {
	Name string `json:"name"`
}

type PostListResponse struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Owner string `json:"owner"`
}

func convertPostListToResponse(list PostList) PostListResponse {
	return PostListResponse{
		Id:    list.Id,
		Name:  list.Name,
		Owner: list.Owner,
	}
}

func (l *ListHandler) CreateList(c echo.Context) error {
	subject, ok := c.Get("user").(*SubjectData)
	if !ok {
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [CreateList] could not convert user data to subject"})
	}

	var request CreateListRequest
	err := c.Bind(&request)
	if err != nil {
		return err
	}

	list := PostList{
		Name:  request.Name,
		Owner: subject.Username,
		Posts: make([]Post, 0),
	}

	list, err = l.store.AddList(list)
	if err != nil {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [CreateList] " + err.Error()})
	}

	return c.JSON(http.StatusCreated, convertPostListToResponse(list))
}

func (l *ListHandler) GetAllLists(c echo.Context) error {
	subject, ok := c.Get("user").(*SubjectData)
	if !ok {
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [GetAllList] could not convert user data to subject"})
	}

	lists, err := l.store.GetAllList(subject.Username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, JsonError{err.Error()})
	}

	responseLists := make([]PostListResponse, len(lists))
	for index, list := range lists {
		responseLists[index] = convertPostListToResponse(list)
	}

	return c.JSON(http.StatusOK, responseLists)
}

func (l *ListHandler) GetListContent(c echo.Context) error {
	subject, ok := c.Get("user").(*SubjectData)
	if !ok {
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [GetListContent] could not convert user data to subject"})
	}

	listId := c.Param("listId")
	if listId == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [GetListContent] listId was empty"})
	}

	list, err := l.store.GetList(listId)
	if err != nil {
		if err == ErrNotFound {
			return c.NoContent(http.StatusNotFound)
		}
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [GetListContent] could not get list"})
	}

	if !list.IsAccessor(subject.Username) {
		return c.NoContent(http.StatusNotFound)
	}

	return c.JSON(http.StatusOK, list)
}
