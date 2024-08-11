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
	PLOT_PEAKS_BASE_URL     = "/crud/plotPeaks"
	USER_BASE_URL           = "/user"
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

	router.POST("/showAll", controller.CreateShowAllController)
	router.GET(SHOW_ALL_BASE_URL+"/:file_name", controller.GetShowAllController)
	router.DELETE(SHOW_ALL_BASE_URL, controller.DeleteShowAllController)
	router.DELETE(SHOW_ALL_BASE_URL+"/all", controller.DeleteAllShowAllController)

	router.POST("/showSingle", controller.CreateShowSingleController)
	router.GET(SHOW_SINGLE_BASE_URL+"/:file_name", controller.GetShowSingleController)
	router.DELETE(SHOW_SINGLE_BASE_URL, controller.DeleteShowSingleController)
	router.DELETE(SHOW_SINGLE_BASE_URL+"/all", controller.DeleteAllShowSingleController)

	router.POST("/showDetection", controller.CreateShowDetectionController)
	router.GET(SHOW_DETECTION_BASE_URL+"/:file_name", controller.GetShowDetectionController)
	router.DELETE(SHOW_DETECTION_BASE_URL, controller.DeleteShowDetectionController)
	router.DELETE(SHOW_DETECTION_BASE_URL+"/all", controller.DeleteAllShowDetectionController)

	router.POST("rasterPlot", controller.CreateRasterPlotController)
	router.GET(RASTER_PLOT_BASE_URL+"/:file_name", controller.GetRasterPlotController)
	router.DELETE(RASTER_PLOT_BASE_URL, controller.DeleteRasterPlotController)
	router.DELETE(RASTER_PLOT_BASE_URL+"/all", controller.DeleteAllRasterPlotController)

	router.GET(DRAW2D_BASE_URL+"/:file_name", controller.GetDraw2dController)
	router.DELETE(DRAW2D_BASE_URL, controller.DeleteDraw2dController)
	router.DELETE(DRAW2D_BASE_URL+"/all", controller.DeleteAllDraw2dController)

	router.GET(DRAW3D_BASE_URL+"/:file_name", controller.GetDraw3dController)
	router.DELETE(DRAW3D_BASE_URL, controller.DeleteDraw3dController)
	router.DELETE(DRAW3D_BASE_URL+"/all", controller.DeleteAllDraw3dController)

	router.POST("/plotPeaks", controller.CreatePlotPeaksController)
	router.GET(PLOT_PEAKS_BASE_URL+"/:file_name", controller.GetPlotPeaksController)
	router.DELETE(PLOT_PEAKS_BASE_URL, controller.DeletePlotPeaksController)
	router.DELETE(PLOT_PEAKS_BASE_URL+"/all", controller.DeleteAllPlotPeaksController)

	return router
}
