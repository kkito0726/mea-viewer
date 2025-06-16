package service

import (
	"encoding/json"
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
	// 読み込みデータからNaNを除去
	meaData = cleanMeaData(meaData)
	var data model.JsonData
	if err := json.Unmarshal([]byte(dms.JsonString), &data); err != nil {
		return nil, errors.BadRequest(enum.F007)
	}

	sliceMeaData := make([][]float32, len(meaData)+1)
	for i, mea := range meaData {
		sliceMeaData[i+1] = mea
	}
	// 時刻データ作成
	t := createTimeData(len(sliceMeaData[1]), int(data.HedValue.SamplingRate), int(data.Start))
	sliceMeaData[0] = t

	return &RequestModel{
		SliceMeaData: sliceMeaData,
		JsonData:     &data,
	}, nil
}

// NaNを除去
func cleanData(data []float32) []float32 {
	cleaned := make([]float32, 0, len(data))
	for _, val := range data {
		if val == val { // NaN でない
			cleaned = append(cleaned, val)
		}
	}
	return cleaned
}

func cleanMeaData(data [][]float32) [][]float32 {
	newMeaData := make([][]float32, len(data))
	for i, val := range data {
		newRow := cleanData(val)
		newMeaData[i] = newRow
	}
	return newMeaData
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
