package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/usecase"
)

func GetImagesController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FigType:  c.Param("figType"),
		FileName: c.Param("filename"),
	}

	images, err := usecase.GetImages(&getImageRequest)
	if err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.JSON(http.StatusOK, images)
}

func DeleteImageController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest
	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := usecase.DeleteImage(&deleteImageRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err.Error()})
	}
	c.Status(http.StatusNoContent)
}

func DeleteAllImagesController(c *gin.Context) {
	var deleteAllRequest model.DeleteAllRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteAllRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := usecase.DeleteImages(&deleteAllRequest, c.Param("figType")); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err.Error()})
	}
	c.Status(http.StatusNoContent)
}

func CreateFigController(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.String(http.StatusBadRequest, "Failed to get multipart form: %s", err)
		return
	}

	jsonString := c.PostForm("jsonData")
	if jsonString == "" {
		c.String(http.StatusBadRequest, "No jsonData provided")
		return
	}

	images, customErr := usecase.CreateFig(form, jsonString)
	if customErr != nil {
		customErr.Logging()
		c.JSON(customErr.StatusCode, gin.H{"error": customErr})
	}
	c.JSON(http.StatusOK, images)
}
