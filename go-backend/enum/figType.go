package enum

type FigType int

const (
	ShowAll FigType = iota
	ShowSingle
	ShowDetection
	RasterPlot
	Draw2d
	Draw3d
)

func (ft FigType) String() string {
	switch ft {
	case ShowAll:
		return "showAll"
	case ShowSingle:
		return "showSingle"
	case ShowDetection:
		return "showDetection"
	case RasterPlot:
		return "rasterPlot"
	case Draw2d:
		return "draw2d"
	case Draw3d:
		return "draw3d"
	default:
		return "未定義"
	}
}
