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

	var data model.JsonData
	if err := json.Unmarshal([]byte(dms.JsonString), &data); err != nil {
		return nil, errors.BadRequest(enum.F007)
	}

	readFrame := lib.CalcReadFrame(&data)

	sliceMeaData := make([][]float32, len(*meaData))
	for i, mea := range *meaData {
		sliceMeaData[i] = mea[int(readFrame.StartFrame):int(readFrame.EndFrame)]
	}

	return &RequestModel{
		SliceMeaData: &sliceMeaData,
		JsonData:     &data,
	}, nil
}

type RequestModel struct {
	SliceMeaData *[][]float32
	JsonData     *model.JsonData
}
