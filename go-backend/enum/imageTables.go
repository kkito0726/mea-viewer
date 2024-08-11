package enum

type ImageTable int

const (
	ShowAllTable ImageTable = iota
	ShowSingleTable
	ShowDetectionTable
	RasterPlotTable
	Draw2dTable
	Draw3dTable
	PlotPeaksTable
)

func (i ImageTable) String() string {
	switch i {
	case ShowAllTable:
		return "show_all_images"
	case ShowSingleTable:
		return "show_single_images"
	case ShowDetectionTable:
		return "show_detection_images"
	case RasterPlotTable:
		return "raster_plot_images"
	case Draw2dTable:
		return "draw2d_images"
	case Draw3dTable:
		return "draw3d_images"
	case PlotPeaksTable:
		return "plot_peaks_images"
	default:
		return "xxx"
	}
}
