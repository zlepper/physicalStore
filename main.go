package main

import (
	"fmt"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/zlepper/go-usermagement/echosupport"
	"log"
	"os"
)

const (
	dataDir       = "data/"
	dataStoreFile = dataDir + "datastore"
)

type JsonError struct {
	Error string `json:"error"`
}

func main() {

	os.MkdirAll(fmt.Sprintf("%s/attachments", dataDir), os.ModePerm)

	dataStore, err := NewDataStore(dataStoreFile)
	if err != nil {
		log.Panicln(err)
	}

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())
	e.Use(middleware.RemoveTrailingSlash())

	apiGroup := e.Group("/api")

	authGroup := apiGroup.Group("/auth")
	authHandler := NewAuthHandler(dataStore)

	// We call this once to ensure a signing secret is generated
	authHandler.GetSigningSecret()

	authResult, err := echosupport.GetUserManagementRouter(authGroup, authHandler)

	listGroup := apiGroup.Group("/lists", authResult.AuthMiddleware)

	BindListHandler(listGroup, dataStore)

	//postGroup := apiGroup.Group("/posts", authResult.AuthMiddleware)

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Skipper: middleware.DefaultSkipper,
		Root:    "./public",
		Index:   "index.html",
		HTML5:   true,
	}))

	e.Logger.Print(e.Start(":8080"))

	dataStore.save()
}
