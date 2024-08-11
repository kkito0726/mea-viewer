package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

var ShowAllService = service.NewImageService(enum.ShowAllTable, repository.MinioRepository{})

func CreateShowAllController(c *gin.Context) {
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

	decodeMeaService := service.DecodeMeaService{
		Form:       form,
		JsonString: jsonString,
	}
	requestModel, customErr := decodeMeaService.HandleRequest()
	if customErr != nil {
		c.JSON(customErr.StatusCode, gin.H{"error": customErr})
	}
	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)

	image, customErr := ShowAllService.CreateImage(meaPlot.ShowAll, &model.FormDto{
		FormValue: &model.FormValue{
			XRatio:  requestModel.JsonData.XRatio,
			YRatio:  requestModel.JsonData.YRatio,
			VoltMin: requestModel.JsonData.VoltMin,
			VoltMax: requestModel.JsonData.VoltMax,
			Start:   requestModel.JsonData.Start,
			End:     requestModel.JsonData.End,
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

func GetShowAllController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FileName: c.Param("file_name"),
	}

	images := ShowAllService.GetImages(&getImageRequest)

	c.JSON(http.StatusOK, images)
}

func DeleteShowAllController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ShowAllService.DeleteImage(&deleteImageRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}

func DeleteAllShowAllController(c *gin.Context) {
	var deleteAllRequest model.DeleteAllRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteAllRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ShowAllService.DeleteAllImage(&deleteAllRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}
