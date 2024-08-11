package lib

import (
	"fmt"
	"image/color"
	"sync"

	"github.com/kkito0726/mea-viewer/model"
	"gonum.org/v1/gonum/stat"
	"gonum.org/v1/plot"
	"gonum.org/v1/plot/font"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/plotutil"
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

func (mp *MeaPlot) ShowDetection(formValue *model.FormValue) (*vgimg.Canvas, error) {
	width := vg.Length(font.Length(formValue.XRatio) * vg.Inch)
	height := vg.Length(font.Length(formValue.YRatio) * vg.Inch)
	img := vgimg.New(width, height)
	dc := draw.New(img)
	p := plot.New()

	p.X.Label.Text = "Time (s)"
	p.Y.Label.Text = "Voltage (μV)"

	var wg sync.WaitGroup
	ch := make(chan struct{}, 8)
	var mu sync.Mutex
	for i := 1; i < len(mp.MeaData); i++ {
		wg.Add(1)
		ch <- struct{}{}
		go func(i int) {
			defer wg.Done()
			defer func() { <-ch }()
			data := make([]float64, len(mp.MeaData[0]))
			for id, volt := range mp.MeaData[i] {
				data[id] = float64(volt)
			}
			mean := stat.Mean(data, nil)
			points := make(plotter.XYs, len(mp.MeaData[i]))
			for j := range points {
				points[j].X = float64(mp.MeaData[0][j])
				points[j].Y = (data[j]-mean)/50 + float64(i)
			}
			line, err := plotter.NewLine(points)
			if err != nil {
				return
			}
			line.Color = COLOR_SET[(i-1)%len(COLOR_SET)]

			mu.Lock()
			p.Add(line)
			mu.Unlock()
		}(i)

	}
	wg.Wait()

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

	p.Y.Min = 0
	p.Y.Max = float64(len(formValue.Chs)) + 1
	p.Y.Tick.Marker = ticks
	p.X.Min = formValue.Start
	p.X.Max = formValue.End

	// p.Draw(draw.Canvas{Canvas: dc.Canvas})
	p.Draw(dc)

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

	peakDetection := NewPeakDetection(mp.MeaData)

	if formValue.PeakFormValue.IsNegative {
		negPeakIndex := peakDetection.DetectPeakNeg(formValue.PeakFormValue.Distance, formValue.PeakFormValue.Threshold, 10)
		if err := rasterPlot(p, negPeakIndex, mp.MeaData); err != nil {
			return nil, err
		}
	}

	if formValue.PeakFormValue.IsPositive {
		posPeakIndex := peakDetection.DetectPeakPos(formValue.PeakFormValue.Distance, formValue.PeakFormValue.Threshold, 10)
		if err := rasterPlot(p, posPeakIndex, mp.MeaData); err != nil {
			return nil, err
		}
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

func (mp *MeaPlot) PlotPeaks(formValue *model.FormValue) (*vgimg.Canvas, error) {
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

	peakDetection := NewPeakDetection(mp.MeaData)
	if formValue.PeakFormValue.IsNegative {
		negPeakIndex := peakDetection.DetectPeakNeg(formValue.PeakFormValue.Distance, formValue.PeakFormValue.Threshold, 10)[1]
		if err := plotPeak(p, negPeakIndex, mp.MeaData, COLOR_SET[1]); err != nil {
			return nil, err
		}
	}

	if formValue.PeakFormValue.IsPositive {
		posPeakIndex := peakDetection.DetectPeakPos(formValue.PeakFormValue.Distance, formValue.PeakFormValue.Threshold, 10)[1]
		if err := plotPeak(p, posPeakIndex, mp.MeaData, COLOR_SET[2]); err != nil {
			return nil, err
		}
	}
	p.X.Min = formValue.Start
	p.X.Max = formValue.End
	p.Y.Min = formValue.VoltMin
	p.Y.Max = formValue.VoltMax

	// p.Draw(draw.Canvas{Canvas: dc.Canvas})
	p.Draw(dc)

	return img, nil
}

func SetFontSize(p *plot.Plot, textFontSize int, labelFontSize int) {
	p.X.Label.TextStyle.Font.Size = vg.Points(float64(textFontSize))  // X軸ラベルのフォントサイズ
	p.Y.Label.TextStyle.Font.Size = vg.Points(float64(labelFontSize)) // Y軸ラベルのフォントサイズ
	p.X.Tick.Label.Font.Size = vg.Points(float64(labelFontSize))      // X軸目盛りラベルのフォントサイズ
	p.Y.Tick.Label.Font.Size = vg.Points(float64(labelFontSize))      // Y軸目盛りラベルのフォントサイズ
}

func rasterPlot(p *plot.Plot, peakIndex [][]int, meaData [][]float32) error {

	for i := 1; i < len(peakIndex); i++ {
		points := make(plotter.XYs, len(peakIndex[i]))
		for j, idx := range peakIndex[i] {
			points[j].X = float64(meaData[0][idx])
			points[j].Y = float64(i)
		}

		line, err := plotter.NewScatter(points)
		if err != nil {
			return err
		}

		line.GlyphStyle.Radius = vg.Points(1)
		line.GlyphStyle.Shape = plotutil.DefaultGlyphShapes[6]

		p.Add(line)
	}
	return nil
}

func plotPeak(p *plot.Plot, peakIndex []int, meaData [][]float32, color color.RGBA) error {
	points := make(plotter.XYs, len(peakIndex))
	for j, idx := range peakIndex {
		points[j].X = float64(meaData[0][idx])
		points[j].Y = float64(meaData[1][idx])
	}

	sc, err := plotter.NewScatter(points)
	if err != nil {
		return err
	}

	sc.GlyphStyle.Radius = vg.Points(3)
	sc.GlyphStyle.Shape = plotutil.DefaultGlyphShapes[6]
	sc.Color = color

	p.Add(sc)
	return nil
}

var COLOR_SET = []color.RGBA{
	{R: 59, G: 117, B: 175, A: 255},
	{R: 234, G: 134, B: 59, A: 255},
	{R: 81, G: 158, B: 62, A: 255},
	{R: 197, G: 58, B: 50, A: 255},
	{R: 141, G: 105, B: 184, A: 255},
	{R: 132, G: 88, B: 78, A: 255},
	{R: 213, G: 125, B: 190, A: 255},
	{R: 127, G: 127, B: 127, A: 255},
	{R: 69, G: 189, B: 69, A: 255},
	{R: 88, G: 187, B: 204, A: 255},
}
