package main

import (
	"github.com/labstack/echo"
	"net/http"
)

type UserDataStore interface {
	// Gets a specific user
	GetUser(username string) (User, error)
}

func BindUserHandler(userGroup *echo.Group, store UserDataStore) error {
	userHandler := &UserHandler{store: store}

	userGroup.GET("/:username", userHandler.GetUser)

	return nil
}

type UserHandler struct {
	store UserDataStore
}

func (u *UserHandler) GetUser(c echo.Context) error {
	_, ok := c.Get("user").(*SubjectData)
	if !ok {
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [GetUser] could not convert user data to subject"})
	}

	username := c.Param("username")
	if username == "" {
		return c.JSON(http.StatusBadRequest, JsonError{"ERR: [GetUser] username was empty"})
	}

	user, err := u.store.GetUser(username)
	if err != nil {
		if err == ErrNotFound {
			return c.JSON(http.StatusOK, UserResponse{Exists: false, Username: username})
		}
		return c.JSON(http.StatusInternalServerError, JsonError{"ERR: [GetUser] Something went wrong when fetching user:\n" + err.Error()})
	}

	return c.JSON(http.StatusOK, UserResponse{
		Username: user.Username,
		Name:     user.Name,
		Exists:   true,
	})
}
