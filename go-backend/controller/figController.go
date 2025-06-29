package controller

import (
	"net/http"
	"sync"
	"time"

	"mime/multipart"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/usecase"
)

type Job struct {
	Status string      // "pending" or "done"
	Result interface{} // 描画結果（画像URLリストなど）
	Err    error
}

var jobs = make(map[string]*Job)
var jobsMu sync.Mutex

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

	jobID := uuid.New().String()
	jobsMu.Lock()
	jobs[jobID] = &Job{Status: "pending"}
	jobsMu.Unlock()

	go func(jobID string, form *multipart.Form, jsonString string) {
		// 非同期で描画処理
		images, err := usecase.CreateFig(form, jsonString)
		jobsMu.Lock()
		defer jobsMu.Unlock()
		if err != nil {
			jobs[jobID].Status = "error"
			jobs[jobID].Err = err
		} else {
			jobs[jobID].Status = "done"
			jobs[jobID].Result = images
		}
	}(jobID, form, jsonString)

	c.JSON(http.StatusAccepted, gin.H{"job_id": jobID})
}

func CreateFigStreamController(c *gin.Context) {
	jobID := c.Param("job_id")
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Flush()

	for {
		jobsMu.Lock()
		job, exists := jobs[jobID]
		jobsMu.Unlock()
		if !exists {
			c.SSEvent("error", "job not found")
			break
		}
		if job.Status == "done" {
			c.SSEvent("message", job.Result)
			jobsMu.Lock()
			delete(jobs, jobID)
			jobsMu.Unlock()
			break
		}
		if job.Status == "error" {
			c.SSEvent("error", job.Err.Error())
			jobsMu.Lock()
			delete(jobs, jobID)
			jobsMu.Unlock()
			break
		}
		time.Sleep(1 * time.Second)
	}
}
