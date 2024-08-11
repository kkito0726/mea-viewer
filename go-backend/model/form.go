package model

import (
	"github.com/kkito0726/mea-viewer/enum"
)

type FormValue struct {
	XRatio        int
	YRatio        int
	VoltMin       float64
	VoltMax       float64
	Start         float64
	End           float64
	PeakFormValue PeakFormValue
	Chs           []int
}

type JsonData struct {
	Start         float64       `json:"start"`
	End           float64       `json:"end"`
	ReadTime      ReadTime      `json:"readTime"`
	HedValue      HedValue      `json:"hedValue"`
	Filename      string        `json:"filename"`
	DPI           int           `json:"dpi"`
	VoltMin       float64       `json:"volt_min"`
	VoltMax       float64       `json:"volt_max"`
	XRatio        int           `json:"x_ratio"`
	YRatio        int           `json:"y_ratio"`
	Chs           []int         `json:"chs"`
	PeakFormValue PeakFormValue `json:"peakFormValue"`
}

type ReadTime struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
}

type HedValue struct {
	SamplingRate float64 `json:"sampling_rate"`
}

type ReadFrame struct {
	StartFrame float64
	EndFrame   float64
}

type PeakFormValue struct {
	IsPositive bool
	IsNegative bool
	Distance   int
	Threshold  int
}

type FormDto struct {
	FormValue     *FormValue
	FileName      string `json:"file_name"`
	FigType       enum.FigType
	Ch            int
	PeakFormValue PeakFormValue
}
