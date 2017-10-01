package main

import (
	"github.com/labstack/echo"
	"github.com/nfnt/resize"
	_ "golang.org/x/image/bmp"
	_ "golang.org/x/image/tiff"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	"image/png"
	"net/http"
	"os"
)

type AttachmentDataStore interface {
	GetAttachment(postId, listId, attachmentId string) (Attachment, error)
}

func BindAttachmentHandler(e *echo.Group, store AttachmentDataStore) {
	handler := &AttachmentHandler{store: store}

	e.GET("/:attachmentId/file", handler.GetFile)
}

type AttachmentHandler struct {
	store AttachmentDataStore
}

func (a *AttachmentHandler) GetFile(c echo.Context) error {
	println("Get file")
	listId := c.Param("listId")
	postId := c.Param("postId")
	attachmentId := c.Param("attachmentId")

	thumbnail := c.QueryParam("thumbnail") != ""

	attachment, err := a.store.GetAttachment(postId, listId, attachmentId)
	if err != nil {
		return c.JSON(http.StatusNotFound, JsonError{err.Error()})
	}

	if attachment.IsImage && thumbnail {
		return c.File(attachmentDir + attachment.Filename + ".thumb")
	}
	return c.File(attachmentDir + attachment.Filename)
}

func createThumbnail(filename string) error {
	file, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		return err
	}
	file.Close()

	m := resize.Thumbnail(400, 600, img, resize.NearestNeighbor)

	out, err := os.Create(filename + ".thumb")
	if err != nil {
		return err
	}
	defer out.Close()

	return png.Encode(out, m)
}
