package service

import (
	"encoding/json"
	"math"
	"mime/multipart"

	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
)

type DecodeMeaService struct {
	Form       *multipart.Form
	JsonString string
}

func (dms *DecodeMeaService) HandleRequest() (*RequestModel, *errors.CustomError) {
	meaData, err := lib.DecodeRequest(dms.Form.File)
	if err != nil {
		return nil, errors.BadRequest(enum.F006)
	}

	var data model.JsonData
	if err := json.Unmarshal([]byte(dms.JsonString), &data); err != nil {
		return nil, errors.BadRequest(enum.F007)
	}

	readFrame := lib.CalcReadFrame(&data)

	sliceMeaData := make([][]float32, len(*meaData)+1)
	start := int(readFrame.StartFrame)
	end := int(readFrame.EndFrame)
	for i, mea := range *meaData {
		if end > len(mea) {
			end = len(mea) // 範囲チェック
		}
		sliceMeaData[i+1] = mea[start:end]
	}
	sliceMeaData = cleanData(sliceMeaData)
	t := createTimeData(len(sliceMeaData[1]), int(data.HedValue.SamplingRate), int(data.ReadTime.Start))
	sliceMeaData[0] = t

	readEnd := sliceMeaData[0][len(sliceMeaData[0])-1]
	if readEnd < float32(data.End) {
		data.End = float64(readEnd)
	}

	return &RequestModel{
		SliceMeaData: sliceMeaData,
		JsonData:     &data,
	}, nil
}

// NaN を含むか判定
func containsNaN(data [][]float32) bool {
	for _, row := range data {
		for _, val := range row {
			if math.IsNaN(float64(val)) {
				return true
			}
		}
	}
	return false
}

// 各行から NaN を除去し、新しい 2D スライスを返す
func cleanData(data [][]float32) [][]float32 {
	if !containsNaN(data) {
		return data
	}

	cleaned := make([][]float32, 0, len(data))
	for _, row := range data {
		newRow := make([]float32, 0, len(row))
		for _, val := range row {
			if !math.IsNaN(float64(val)) {
				newRow = append(newRow, val)
			}
		}
		cleaned = append(cleaned, newRow)
	}

	return cleaned
}

func createTimeData(dataLength int, samplingRate int, startTime int) []float32 {
	t := make([]float32, dataLength)
	invRate := 1.0 / float32(samplingRate)
	for i := 0; i < dataLength; i++ {
		t[i] = float32(i)*invRate + float32(startTime)
	}

	return t
}

type RequestModel struct {
	SliceMeaData [][]float32
	JsonData     *model.JsonData
}
