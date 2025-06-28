package router

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/controller"
)

const (
	FIG_BASE_URL  = "/fig"
	USER_BASE_URL = "/user"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:4173", "https://mea-viewer.vercel.app"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("", controller.HealthController)

	router.POST(USER_BASE_URL, controller.CreateUserController)
	router.POST(USER_BASE_URL+"/login", controller.LoginUserController)
	router.DELETE(USER_BASE_URL+"/logout", controller.LogoutUserController)
	router.PUT(USER_BASE_URL, controller.UpdateUserController)
	router.DELETE(USER_BASE_URL, controller.DeleteUserController)

	router.GET(FIG_BASE_URL+"/:figType/:filename", controller.GetImagesController)
	router.DELETE(FIG_BASE_URL+"/:figType", controller.DeleteImageController)
	router.DELETE(FIG_BASE_URL+"/all/:figType", controller.DeleteAllImagesController)

	router.POST("/draw", controller.CreateFigController)
	router.GET("/draw/stream/:job_id", controller.CreateFigStreamController)

	return router
}
