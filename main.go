package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/zlepper/go-usermagement/echosupport"
	"log"
	"os"
)

const (
	dataDir       = "data/"
	dataStoreFile = dataDir + "datastore"
	attachmentDir = dataDir + "attachments/"
)

type JsonError struct {
	Error string `json:"error"`
}

func main() {

	os.MkdirAll(attachmentDir, os.ModePerm)

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

	// http://localhost:8080/api/lists21aaaf80416b4152ab07076f041e329f/posts/d103ad9bceb94871b38e8b1627ab8eb4/attachments/5534ffb0bfc34d4ba8fa8d25cfc08f64/file?thumbnail=yes
	listGroup := apiGroup.Group("/lists", authResult.AuthMiddleware)

	BindListHandler(listGroup, dataStore)

	postGroup := listGroup.Group("/:listId/posts", authResult.AuthMiddleware)

	BindPostHandler(postGroup, dataStore)

	attachmentGroup := e.Group("/api/lists/:listId/posts/:postId/attachments")

	BindAttachmentHandler(attachmentGroup, dataStore)

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Skipper: middleware.DefaultSkipper,
		Root:    "./public/",
		Index:   "index.html",
		HTML5:   true,
	}))

	go dataStore.StartAutomaticSaving()

	e.Logger.Print(e.Start(":8080"))

	dataStore.save()
}
