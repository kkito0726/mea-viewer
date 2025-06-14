package enum

import (
	"fmt"
)

type FigType int

const (
	ShowAll FigType = iota
	ShowSingle
	ShowDetection
	RasterPlot
	Draw2d
	Draw3d
	PlotPeaks
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
	case PlotPeaks:
		return "plotPeaks"
	default:
		return "未定義"
	}
}

func ParseFigType(s string) (FigType, error) {
	switch s {
	case "showAll":
		return ShowAll, nil
	case "showSingle":
		return ShowSingle, nil
	case "showDetection":
		return ShowDetection, nil
	case "rasterPlot":
		return RasterPlot, nil
	case "draw2d":
		return Draw2d, nil
	case "draw3d":
		return Draw3d, nil
	case "plotPeaks":
		return PlotPeaks, nil
	default:
		return 0, fmt.Errorf("無効なFigType: %s", s)
	}
}
