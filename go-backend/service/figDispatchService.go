package service

import (
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

func FigDispatch(requestModel *RequestModel) ([]model.Image, *errors.CustomError) {
	figType, err := enum.ParseFigType(requestModel.JsonData.FigType)
	if err != nil {
		return nil, errors.BadRequest(enum.F009)
	}

	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)
	switch figType {
	case enum.ShowAll:
		images := make([]model.Image, 1)
		imageService := NewImageService(enum.ShowAllTable, repository.MinioRepository{})
		image, customErr := imageService.CreateImage(meaPlot.ShowAll, &model.FormDto{
			FormValue: &model.FormValue{
				XRatio:  requestModel.JsonData.XRatio,
				YRatio:  requestModel.JsonData.YRatio,
				VoltMin: requestModel.JsonData.VoltMin,
				VoltMax: requestModel.JsonData.VoltMax,
				Start:   requestModel.JsonData.Start,
				End:     requestModel.JsonData.End,
			},
			FileName: requestModel.JsonData.Filename,
			FigType:  enum.ShowAll,
		})
		images[0] = *image
		return images, customErr
	default:
		return nil, errors.BadRequest(enum.F009)
	}
}
