package lib

import (
	"sort"
	"sync"

	"gonum.org/v1/gonum/stat"
)

type PeakDetection struct {
	MeaData [][]float32
}

func NewPeakDetection(meaData [][]float32) *PeakDetection {
	return &PeakDetection{MeaData: meaData}
}

func (pd *PeakDetection) DetectPeakNeg(distance, threshold, minAmp int) [][]int {
	peakIndex := make([][]int, len(pd.MeaData))

	var wg sync.WaitGroup
	ch := make(chan struct{}, 8)
	var mu sync.Mutex

	for i := 1; i < len(pd.MeaData); i++ {
		wg.Add(1)
		ch <- struct{}{}
		go func(i int) {
			defer wg.Done()
			defer func() { <-ch }()
			data := make([]float64, len(pd.MeaData[i]))
			for i, d := range pd.MeaData[i] {
				data[i] = float64(d)
			}
			height := stat.StdDev(data, nil) * float64(threshold)
			if height < float64(minAmp) {
				height = float64(minAmp)
			}

			peaks := findPeaksNeg(data, height, distance)
			sort.Ints(peaks)
			mu.Lock()
			peakIndex[i] = peaks
			mu.Unlock()
		}(i)

	}
	wg.Wait()
	return peakIndex
}

func (pd *PeakDetection) DetectPeakPos(distance, threshold, minAmp int) [][]int {
	peakIndex := make([][]int, len(pd.MeaData))

	var wg sync.WaitGroup
	ch := make(chan struct{}, 8)
	var mu sync.Mutex

	for i := 1; i < len(pd.MeaData); i++ {
		wg.Add(1)
		ch <- struct{}{}
		go func(i int) {
			defer wg.Done()
			defer func() { <-ch }()
			data := make([]float64, len(pd.MeaData[i]))
			for i, d := range pd.MeaData[i] {
				data[i] = float64(d)
			}
			height := stat.StdDev(data, nil) * float64(threshold)
			if height < float64(minAmp) {
				height = float64(minAmp)
			}

			peaks := findPeaksPos(data, height, distance)
			sort.Ints(peaks)
			mu.Lock()
			peakIndex[i] = peaks
			mu.Unlock()
		}(i)

	}
	wg.Wait()
	return peakIndex
}

func findPeaksNeg(data []float64, height float64, distance int) []int {
	negData := make([]float64, len(data))
	for i := range data {
		negData[i] = -data[i]
	}

	peaks := []int{}
	for i := 1; i < len(negData)-1; i++ {
		if negData[i] > negData[i-1] && negData[i] > negData[i+1] && negData[i] >= height {
			if len(peaks) == 0 || i-peaks[len(peaks)-1] >= distance {
				peaks = append(peaks, i)
			}
		}
	}

	// 幅とプロミネンスに基づく追加フィルタリングをここに追加できます

	return peaks
}

func findPeaksPos(data []float64, height float64, distance int) []int {
	peaks := []int{}
	for i := 1; i < len(data)-1; i++ {
		if data[i] > data[i-1] && data[i] > data[i+1] && data[i] >= height {
			if len(peaks) == 0 || i-peaks[len(peaks)-1] >= distance {
				peaks = append(peaks, i)
			}
		}
	}

	// 幅とプロミネンスに基づく追加フィルタリングをここに追加できます

	return peaks
}
