package controller

import (
	"encoding/json"
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

var ShowAllService = service.NewImageService(enum.ShowAllTable)

func CreateShowAllController(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.String(http.StatusBadRequest, "Failed to get multipart form: %s", err)
		return
	}
	var files [][]*multipart.FileHeader
	// files := form.File["file"]

	for _, file := range form.File {
		files = append(files, file)
	}
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "MEAデータを読み込めませんでした"})
		return
	}
	meaData, err := lib.DecodeRequest(files)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "MEAデータを読み込めませんでした"})
	}

	jsonData := c.PostForm("jsonData")
	if jsonData == "" {
		c.String(http.StatusBadRequest, "No jsonData provided")
		return
	}
	var data model.JsonData
	if err := json.Unmarshal([]byte(jsonData), &data); err != nil {
		c.String(http.StatusBadRequest, "Invalid jsonData: %s", err)
		return
	}

	readFrame := lib.CalcReadFrame(&data)

	sliceMeaData := make([][]float32, len(*meaData))
	for i, mea := range *meaData {
		sliceMeaData[i] = mea[int(readFrame.StartFrame):int(readFrame.EndFrame)]
	}

	buf := lib.ShowAll(sliceMeaData, model.FormValue{
		XRatio:  data.XRatio,
		YRatio:  data.YRatio,
		DPI:     data.DPI,
		VoltMin: data.VoltMin,
		VoltMax: data.VoltMax,
		Start:   data.ReadTime.Start,
		End:     data.ReadTime.End,
	})

	image_url, err := repository.SaveImage(enum.ShowAll.String(), buf, data.Filename)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "画像のアップロードに失敗しました"})
	}

	imageRepository := *repository.NewImageRepository(enum.ShowAllTable)
	image := model.Image{
		ImageUrl: image_url,
		Filename: data.Filename,
	}
	imageRepository.CreateImage(&image)

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
