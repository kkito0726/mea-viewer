package lib

import (
	"bytes"
	"image/color"
	"image/png"

	"github.com/kkito0726/mea-viewer/model"
	"gonum.org/v1/plot"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/vg"
	"gonum.org/v1/plot/vg/draw"
	"gonum.org/v1/plot/vg/vgimg"
)

func ShowAll(data [][]float32, formValue model.FormValue) *bytes.Buffer {
	width := vg.Length(formValue.XRatio)
	height := vg.Length(formValue.YRatio)

	p := plot.New()

	p.X.Min = formValue.Start
	p.X.Max = formValue.End
	p.Y.Min = formValue.VoltMin
	p.Y.Max = formValue.VoltMax

	for i := 1; i < 65; i++ {
		lineData := make(plotter.XYs, len(data[0]))
		for j := range data[0] {
			lineData[j].X = float64(data[0][j])
			lineData[j].Y = float64(data[i][j])
		}
		line, err := plotter.NewLine(lineData)
		if err != nil {
			panic(err)
		}
		line.Color = color.RGBA{R: uint8(i * 4), G: uint8(i * 2), B: uint8(i * 3), A: 255}
		p.Add(line)
	}

	img := vgimg.New(width, height)
	dc := draw.New(img)
	p.Draw(dc)

	buf := new(bytes.Buffer)
	if err := png.Encode(buf, img.Image()); err != nil {
		panic(err)
	}

	return buf
}
