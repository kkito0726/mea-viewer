package router

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/controller"
)

const (
	SHOW_ALL_BASE_URL       = "/crud/showAll"
	SHOW_SINGLE_BASE_URL    = "crud/showSingle"
	SHOW_DETECTION_BASE_URL = "/crud/showDetection"
	RASTER_PLOT_BASE_URL    = "/crud/rasterPlot"
	DRAW2D_BASE_URL         = "/crud/draw2d"
	DRAW3D_BASE_URL         = "/crud/draw3d"
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

	router.GET(SHOW_ALL_BASE_URL+"/:file_name", controller.GetShowAllController)
	router.DELETE(SHOW_ALL_BASE_URL, controller.DeleteShowAllController)
	router.DELETE(SHOW_ALL_BASE_URL+"/all", controller.DeleteAllShowAllController)

	router.GET(SHOW_SINGLE_BASE_URL+"/:file_name", controller.GetShowSingleController)
	router.DELETE(SHOW_SINGLE_BASE_URL, controller.DeleteShowSingleController)
	router.DELETE(SHOW_SINGLE_BASE_URL+"/all", controller.DeleteAllShowSingleController)

	router.GET(SHOW_DETECTION_BASE_URL+"/:file_name", controller.GetShowDetectionController)
	router.DELETE(SHOW_DETECTION_BASE_URL, controller.DeleteShowDetectionController)
	router.DELETE(SHOW_DETECTION_BASE_URL+"/all", controller.DeleteAllShowDetectionController)

	router.GET(RASTER_PLOT_BASE_URL+"/:file_name", controller.GetRasterPlotController)
	router.DELETE(RASTER_PLOT_BASE_URL, controller.DeleteRasterPlotController)
	router.DELETE(RASTER_PLOT_BASE_URL+"/all", controller.DeleteAllRasterPlotController)

	router.GET(DRAW2D_BASE_URL+"/:file_name", controller.GetDraw2dController)
	router.DELETE(DRAW2D_BASE_URL, controller.DeleteDraw2dController)
	router.DELETE(DRAW2D_BASE_URL+"/all", controller.DeleteAllDraw2dController)

	router.GET(DRAW3D_BASE_URL+"/:file_name", controller.GetDraw3dController)
	router.DELETE(DRAW3D_BASE_URL, controller.DeleteDraw3dController)
	router.DELETE(DRAW3D_BASE_URL+"/all", controller.DeleteAllDraw3dController)

	return router
}