package usecase

import (
	"mime/multipart"

	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

func GetImages(getImageRequest *model.GetImageRequest) ([]model.Image, *errors.CustomError) {
	table, err := enum.ParseImageTable(getImageRequest.FigType)
	if err != nil {
		return nil, errors.BadRequest(enum.F009)
	}

	imageService := service.NewImageService(table, repository.MinioRepository{})
	return imageService.GetImages(getImageRequest), nil
}

func DeleteImage(deleteImageRequest *model.DeleteRequest, figTypeStr string) *errors.CustomError {
	table, err := enum.ParseImageTable(figTypeStr)
	if err != nil {
		return errors.BadRequest(enum.F009)
	}

	imageService := service.NewImageService(table, repository.MinioRepository{})
	return imageService.DeleteImage(deleteImageRequest)
}

func DeleteImages(deleteAllRequest *model.DeleteAllRequest, figTypeStr string) *errors.CustomError {
	table, err := enum.ParseImageTable(figTypeStr)
	if err != nil {
		return errors.BadRequest(enum.F009)
	}

	imageService := service.NewImageService(table, repository.MinioRepository{})
	return imageService.DeleteAllImage(deleteAllRequest)
}

func CreateFig(form *multipart.Form, jsonString string) ([]model.Image, *errors.CustomError) {
	decodeMeaService := service.DecodeMeaService{
		Form:       form,
		JsonString: jsonString,
	}
	requestModel, customErr := decodeMeaService.HandleRequest()
	if customErr != nil {
		return nil, customErr
	}
	println(len(requestModel.SliceMeaData))
	println(len(requestModel.SliceMeaData[0]))
	println(len(requestModel.SliceMeaData[1]))
	images, err := service.FigDispatch(requestModel)
	if err != nil {
		return nil, err
	}
	return images, nil
}
