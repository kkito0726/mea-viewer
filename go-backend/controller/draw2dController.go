package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/service"
)

const DRAW2D_TABLE = "draw2d_images"

var draw2dService = service.NewImageService(DRAW2D_TABLE)

func GetDraw2dController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FileName: c.Param("file_name"),
	}

	images := draw2dService.GetImages(&getImageRequest)

	c.JSON(http.StatusOK, images)
}

func DeleteDraw2dController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := draw2dService.DeleteImage(&deleteImageRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}

func DeleteAllDraw2dController(c *gin.Context) {
	var deleteAllRequest model.DeleteAllRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteAllRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := draw2dService.DeleteAllImage(&deleteAllRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}
