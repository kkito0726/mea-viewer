package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

func GetImagesController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FigType:  c.Param("figType"),
		FileName: c.Param("filename"),
	}

	table, err := enum.ParseImageTable(getImageRequest.FigType)
	if err != nil {
		customErr := errors.ServerError(enum.F009)
		customErr.Logging()
		c.JSON(http.StatusBadRequest, gin.H{"error": customErr})
	}

	imageService := service.NewImageService(table, repository.MinioRepository{})
	images := imageService.GetImages(&getImageRequest)
	c.JSON(http.StatusOK, images)
}

func DeleteImageController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest
	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	table, err := enum.ParseImageTable(c.Param("figType"))
	if err != nil {
		customErr := errors.ServerError(enum.F009)
		customErr.Logging()
		c.JSON(http.StatusBadRequest, gin.H{"error": customErr})
	}

	imageService := service.NewImageService(table, repository.MinioRepository{})
	if err := imageService.DeleteImage((&deleteImageRequest)); err != nil {
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

	table, err := enum.ParseImageTable(c.Param("figType"))
	if err != nil {
		customErr := errors.ServerError(enum.F009)
		customErr.Logging()
		c.JSON(http.StatusBadRequest, gin.H{"error": customErr})
	}

	imageService := service.NewImageService(table, repository.MinioRepository{})
	if err := imageService.DeleteAllImage(&deleteAllRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}
