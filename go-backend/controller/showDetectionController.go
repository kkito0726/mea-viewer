package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

var showDetectionService = service.NewImageService(enum.ShowDetectionTable, repository.MinioRepository{})

func CreateShowDetectionController(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		customErr := errors.BadRequest(enum.C000)
		c.JSON(customErr.StatusCode, gin.H{"error": customErr})
	}
	jsonString := c.PostForm("jsonData")
	if jsonString == "" {
		customErr := errors.BadRequest(enum.C000)
		c.JSON(customErr.StatusCode, gin.H{"error": customErr})
	}

	decodeMeaService := service.DecodeMeaService{
		Form:       form,
		JsonString: jsonString,
	}

	requestModel, customErr := decodeMeaService.HandleRequest()
	if customErr != nil {
		c.JSON(customErr.StatusCode, gin.H{"error": customErr})
	}

	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)
	image, customErr := showDetectionService.CreateImage(meaPlot.ShowDetection, &model.FormDto{
		FormValue: &model.FormValue{
			XRatio:  requestModel.JsonData.XRatio,
			YRatio:  requestModel.JsonData.YRatio,
			VoltMin: requestModel.JsonData.VoltMin,
			VoltMax: requestModel.JsonData.VoltMax,
			Start:   requestModel.JsonData.Start,
			End:     requestModel.JsonData.End,
			Chs:     requestModel.JsonData.Chs,
		},
		FileName: requestModel.JsonData.Filename,
		FigType:  enum.ShowAll,
	})

	if customErr != nil {
		customErr.Logging()
		c.JSON(customErr.StatusCode, gin.H{"error": customErr})
	}

	c.JSON(http.StatusOK, image)
}

func GetShowDetectionController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FileName: c.Param("file_name"),
	}

	images := showDetectionService.GetImages(&getImageRequest)

	c.JSON(http.StatusOK, images)
}

func DeleteShowDetectionController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := showDetectionService.DeleteImage(&deleteImageRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}

func DeleteAllShowDetectionController(c *gin.Context) {
	var deleteAllRequest model.DeleteAllRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteAllRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := showDetectionService.DeleteAllImage(&deleteAllRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}
