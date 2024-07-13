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
		return "ShowAll"
	case ShowSingle:
		return "ShowSingle"
	case ShowDetection:
		return "ShowDetection"
	case RasterPlot:
		return "RasterPlot"
	case Draw2d:
		return "Draw2d"
	case Draw3d:
		return "Draw3d"
	default:
		return "未定義"
	}
}
