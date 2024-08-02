package lib

import (
	"sort"

	"gonum.org/v1/gonum/stat"
)

func DetectPeakNeg(MEAData [][]float32, distance, threshold, minAmp int) [][]int {
	peakIndex := make([][]int, len(MEAData))

	for i := 1; i < len(MEAData); i++ {
		data := make([]float64, len(MEAData[i]))
		for i, d := range MEAData[i] {
			data[i] = float64(d)
		}
		height := stat.StdDev(data, nil) * float64(threshold)
		if height < float64(minAmp) {
			height = float64(minAmp)
		}

		peaks := findPeaksNeg(data, height, distance)
		sort.Ints(peaks)
		peakIndex[i] = peaks
	}

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
