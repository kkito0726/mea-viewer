package lib

import (
	"github.com/kkito0726/mea-viewer/model"
	"gonum.org/v1/plot"
	"gonum.org/v1/plot/font"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/vg"
	"gonum.org/v1/plot/vg/draw"
	"gonum.org/v1/plot/vg/vgimg"
)

type MeaPlot struct {
	MeaData [][]float32
}

func NewMeaPlot(meaData [][]float32) *MeaPlot {
	return &MeaPlot{
		MeaData: meaData,
	}
}

func (mp *MeaPlot) ShowSingle(ch int, formValue *model.FormValue) *vgimg.Canvas {
	width := vg.Length(font.Length(formValue.XRatio) * vg.Inch)
	height := vg.Length(font.Length(formValue.YRatio) * vg.Inch)
	img := vgimg.New(width, height)
	dc := draw.New(img)
	p := plot.New()

	p.X.Label.Text = "Time (s)"
	p.Y.Label.Text = "Voltage (μV)"

	SetFontSize(p, 20, 30)

	points := make(plotter.XYs, len(mp.MeaData[0]))
	for i := range points {
		points[i].X = float64(mp.MeaData[0][i])
		points[i].Y = float64(mp.MeaData[ch][i])
	}

	line, err := plotter.NewLine(points)
	if err != nil {
		panic(err)
	}

	p.Add(line)

	p.X.Min = formValue.Start
	p.X.Max = formValue.End
	p.Y.Min = formValue.VoltMin
	p.Y.Max = formValue.VoltMax

	// p.Draw(draw.Canvas{Canvas: dc.Canvas})
	p.Draw(dc)

	return img
}

func (mp *MeaPlot) ShowAll(formValue *model.FormValue) *vgimg.Canvas {
	// キャンバスのサイズを設定
	const rows, cols = 8, 8
	width := vg.Length(16 * vg.Inch)
	height := vg.Length(16 * vg.Inch)
	img := vgimg.New(width, height)
	dc := draw.New(img)

	// サブプロットのサイズを計算
	subPlotWidth := width / vg.Length(cols)
	subPlotHeight := height / vg.Length(rows)

	// 各サブプロットを描画
	for row := 0; row < rows; row++ {
		for col := 0; col < cols; col++ {
			// サブプロットを作成
			subPlot := plot.New()

			// データポイントの作成
			channel := row*cols + col + 1
			if channel >= len(mp.MeaData) {
				continue
			}
			points := make(plotter.XYs, len(mp.MeaData[0]))
			for i := range points {
				points[i].X = float64(mp.MeaData[0][i])
				points[i].Y = float64(mp.MeaData[channel][i])
			}

			line, err := plotter.NewLine(points)
			if err != nil {
				panic(err)
			}
			subPlot.Add(line)
			subPlot.X.Min = formValue.Start
			subPlot.X.Max = formValue.End
			subPlot.Y.Min = formValue.VoltMin
			subPlot.Y.Max = formValue.VoltMax

			SetFontSize(subPlot, 20, 16)

			// サブプロットの描画位置を計算
			x := vg.Length(col) * subPlotWidth
			y := height - vg.Length(row+1)*subPlotHeight

			// サブプロットを描画
			subPlot.Draw(draw.Canvas{
				Canvas: dc.Canvas,
				Rectangle: vg.Rectangle{
					Min: vg.Point{X: x, Y: y},
					Max: vg.Point{X: x + subPlotWidth, Y: y + subPlotHeight},
				},
			})

		}
	}
	return img
}

func SetFontSize(p *plot.Plot, textFontSize int, labelFontSize int) {
	p.X.Label.TextStyle.Font.Size = vg.Points(float64(textFontSize))  // X軸ラベルのフォントサイズ
	p.Y.Label.TextStyle.Font.Size = vg.Points(float64(labelFontSize)) // Y軸ラベルのフォントサイズ
	p.X.Tick.Label.Font.Size = vg.Points(float64(labelFontSize))      // X軸目盛りラベルのフォントサイズ
	p.Y.Tick.Label.Font.Size = vg.Points(float64(labelFontSize))      // Y軸目盛りラベルのフォントサイズ
}