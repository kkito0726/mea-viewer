package controller

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

var ShowSingleService = service.NewImageService(enum.ShowSingleTable, repository.MinioRepository{})

func CreateShowSingleController(c *gin.Context) {
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

	var wg sync.WaitGroup
	ch := make(chan struct{}, 8)
	images := make([]*model.Image, len(requestModel.JsonData.Chs))
	var mu sync.Mutex
	for i, meaCh := range requestModel.JsonData.Chs {
		wg.Add(1)
		ch <- struct{}{}
		go func(i, meaCh int) {
			defer wg.Done()
			defer func() { <-ch }()
			singleChannelMeaData := [][]float32{requestModel.SliceMeaData[0], requestModel.SliceMeaData[i+1]}
			meaPlot := lib.NewMeaPlot(singleChannelMeaData)

			image, customErr := ShowSingleService.CreateImage(meaPlot.ShowSingle, &model.FormDto{
				FormValue: &model.FormValue{
					XRatio:  requestModel.JsonData.XRatio,
					YRatio:  requestModel.JsonData.YRatio,
					VoltMin: requestModel.JsonData.VoltMin,
					VoltMax: requestModel.JsonData.VoltMax,
					Start:   requestModel.JsonData.Start,
					End:     requestModel.JsonData.End,
				},
				FileName: requestModel.JsonData.Filename,
				FigType:  enum.ShowSingle,
				Ch:       meaCh,
			})
			if customErr != nil {
				mu.Lock()
				customErr.Logging()
				c.JSON(customErr.StatusCode, gin.H{"error": customErr})
				mu.Unlock()
				return
			}
			mu.Lock()
			images[i] = image
			mu.Unlock()
		}(i, meaCh)

	}
	wg.Wait()
	c.JSON(http.StatusOK, images)
}

func GetShowSingleController(c *gin.Context) {
	getImageRequest := model.GetImageRequest{
		FileName: c.Param("file_name"),
	}

	images := ShowSingleService.GetImages(&getImageRequest)

	c.JSON(http.StatusOK, images)
}

func DeleteShowSingleController(c *gin.Context) {
	var deleteImageRequest model.DeleteRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteImageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ShowSingleService.DeleteImage(&deleteImageRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}

func DeleteAllShowSingleController(c *gin.Context) {
	var deleteAllRequest model.DeleteAllRequest

	// リクエストボディを構造体にバインド
	if err := c.ShouldBindJSON(&deleteAllRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ShowSingleService.DeleteAllImage(&deleteAllRequest); err != nil {
		err.Logging()
		c.JSON(err.StatusCode, gin.H{"error": err})
	}
	c.Status(http.StatusNoContent)
}
