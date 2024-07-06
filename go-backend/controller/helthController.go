package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HealthController(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Hello world!!"})
}
