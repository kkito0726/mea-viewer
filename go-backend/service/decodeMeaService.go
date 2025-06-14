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

	readFrame := lib.CalcReadFrame(&data)

	sliceMeaData := make([][]float32, len(meaData)+1)
	start := int(readFrame.StartFrame)
	end := int(readFrame.EndFrame)
	for i, mea := range meaData {
		if end > len(mea) {
			end = len(mea) // 範囲チェック
		}
		sliceMeaData[i+1] = mea[start:end]
	}
	// 時刻データ作成
	t := createTimeData(len(sliceMeaData[1]), int(data.HedValue.SamplingRate), int(data.ReadTime.Start))
	sliceMeaData[0] = t

	// 時刻データの末尾がプロット終了時間よりも前の場合はプロット終了時間を変更
	readEnd := sliceMeaData[0][len(sliceMeaData[0])-1]
	if readEnd < float32(data.End) {
		data.End = float64(readEnd)
	}

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
