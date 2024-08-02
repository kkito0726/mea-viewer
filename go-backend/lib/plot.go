package lib

import (
	"fmt"

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

type PlotMethod func(*model.FormValue) (*vgimg.Canvas, error)

func NewMeaPlot(meaData [][]float32) *MeaPlot {
	return &MeaPlot{
		MeaData: meaData,
	}
}

// 時刻データ+1電極データを受け取る想定
func (mp *MeaPlot) ShowSingle(formValue *model.FormValue) (*vgimg.Canvas, error) {
	width := vg.Length(font.Length(formValue.XRatio) * vg.Inch)
	height := vg.Length(font.Length(formValue.YRatio) * vg.Inch)
	img := vgimg.New(width, height)
	dc := draw.New(img)
	p := plot.New()

	p.X.Label.Text = "Time (s)"
	p.Y.Label.Text = "Voltage (μV)"

	SetFontSize(p, 20, 16)

	points := make(plotter.XYs, len(mp.MeaData[0]))
	for i := range points {
		points[i].X = float64(mp.MeaData[0][i])
		points[i].Y = float64(mp.MeaData[1][i])
	}

	line, err := plotter.NewLine(points)
	if err != nil {
		return nil, err
	}

	p.Add(line)

	p.X.Min = formValue.Start
	p.X.Max = formValue.End
	p.Y.Min = formValue.VoltMin
	p.Y.Max = formValue.VoltMax

	// p.Draw(draw.Canvas{Canvas: dc.Canvas})
	p.Draw(dc)

	return img, nil
}

// 時刻データ+64電極データを受け取る想定
func (mp *MeaPlot) ShowAll(formValue *model.FormValue) (*vgimg.Canvas, error) {
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
	channel := 1
	for row := 0; row < rows; row++ {
		for col := 0; col < cols; col++ {
			// サブプロットを作成
			subPlot := plot.New()

			points := make(plotter.XYs, len(mp.MeaData[0]))
			for i := range points {
				points[i].X = float64(mp.MeaData[0][i])
				points[i].Y = float64(mp.MeaData[channel][i])
			}

			line, err := plotter.NewLine(points)
			if err != nil {
				return nil, err
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
			channel++
		}
	}
	return img, nil
}

func (mp *MeaPlot) RasterPlot(formValue *model.FormValue) (*vgimg.Canvas, error) {
	width := vg.Length(font.Length(formValue.XRatio) * vg.Inch)
	height := vg.Length(font.Length(formValue.YRatio) * vg.Inch)
	img := vgimg.New(width, height)
	dc := draw.New(img)
	p := plot.New()

	p.X.Label.Text = "Time (s)"
	p.Y.Label.Text = "Electrode Number"

	peakIndex := DetectPeakNeg(mp.MeaData, formValue.PeakFormValue.Distance, formValue.PeakFormValue.Threshold, 10)

	// 各電極のピークインデックスをプロット
	for i := 1; i < len(peakIndex); i++ {
		points := make(plotter.XYs, len(peakIndex[i]))
		for j, idx := range peakIndex[i] {
			points[j].X = float64(mp.MeaData[0][idx])
			points[j].Y = float64(i)
		}

		line, err := plotter.NewScatter(points)
		if err != nil {
			return nil, err
		}

		// line.GlyphStyle.Shape = plot.BoxGlyph{}
		// line.GlyphStyle.Color = color.RGBA{R: 255, G: 255, B: 255}
		line.GlyphStyle.Radius = vg.Points(2)
		p.Add(line)
	}
	// 縦軸の目盛りを電極番号に変更
	eleLabel := make([]string, len(formValue.Chs))
	for i, ch := range formValue.Chs {
		eleLabel[i] = fmt.Sprintf("%d", ch)
	}

	// カスタムティッカーの作成
	ticks := plot.TickerFunc(func(min, max float64) []plot.Tick {
		t := make([]plot.Tick, len(eleLabel))
		for i := 0; i < len(eleLabel); i++ {
			t[i] = plot.Tick{Value: float64(i + 1), Label: eleLabel[i]}
		}
		return t
	})

	p.Y.Tick.Marker = ticks
	p.X.Min = formValue.Start
	p.X.Max = formValue.End
	p.Y.Min = -1
	p.Y.Max = float64(len(mp.MeaData))

	p.Draw(dc)

	return img, nil
}

func SetFontSize(p *plot.Plot, textFontSize int, labelFontSize int) {
	p.X.Label.TextStyle.Font.Size = vg.Points(float64(textFontSize))  // X軸ラベルのフォントサイズ
	p.Y.Label.TextStyle.Font.Size = vg.Points(float64(labelFontSize)) // Y軸ラベルのフォントサイズ
	p.X.Tick.Label.Font.Size = vg.Points(float64(labelFontSize))      // X軸目盛りラベルのフォントサイズ
	p.Y.Tick.Label.Font.Size = vg.Points(float64(labelFontSize))      // Y軸目盛りラベルのフォントサイズ
}
