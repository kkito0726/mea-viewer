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

var rasterPlotService = service.NewImageService(enum.RasterPlotTable, repository.MinioRepository{})

func CreateRasterPlotController(c *gin.Context) {
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

	image, customErr := rasterPlotService.CreateImage(meaPlot.RasterPlot, &model.FormDto{
		FormValue: &model.FormValue{
			XRatio:        requestModel.JsonData.XRatio,
			YRatio:        requestModel.JsonData.YRatio,
			VoltMin:       requestModel.JsonData.VoltMin,
			VoltMax:       requestModel.JsonData.VoltMax,
			Start:         requestModel.JsonData.Start,
			End:           requestModel.JsonData.End,
			PeakFormValue: requestModel.JsonData.PeakFormValue,
			Chs:           requestModel.JsonData.Chs,
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
