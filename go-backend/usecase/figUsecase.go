package usecase

import (
	"mime/multipart"

	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
	"github.com/kkito0726/mea-viewer/service"
)

var imageRepository = repository.ImageRepository{}
var minioRepository = repository.MinioRepository{}

func GetImages(getImageRequest *model.GetImageRequest) ([]model.FigImage, *errors.CustomError) {
	images, err := imageRepository.GetImages(getImageRequest)
	if err != nil {
		return nil, errors.NotFoundError(enum.F010)
	}
	return images, nil
}

func DeleteImage(deleteImageRequest *model.DeleteRequest) *errors.CustomError {
	if err := minioRepository.DeleteFile(deleteImageRequest.ImageURL); err != nil {
		return errors.ServerError(enum.F001)
	}
	if err := imageRepository.DeleteImage(deleteImageRequest); err != nil {
		return errors.ServerError(enum.F002)
	}
	return nil
}

func DeleteImages(deleteAllRequest *model.DeleteAllRequest, figTypeStr string) *errors.CustomError {
	// 削除対象のレコードを取得
	images, err := imageRepository.GetImages(
		&model.GetImageRequest{
			FigType:  figTypeStr,
			FileName: deleteAllRequest.FileName,
		},
	)
	if err != nil {
		return errors.NotFoundError(enum.F010)
	}

	// 削除対象のファイルを全削除
	for _, image := range images {
		err := minioRepository.DeleteFile(image.ImageUrl)
		if err != nil {
			return errors.ServerError(enum.F001)
		}
	}

	// 削除対象のレコードを全削除
	if err := imageRepository.DeleteAllImages(figTypeStr, deleteAllRequest.FileName); err != nil {
		return errors.ServerError(enum.F002)
	}
	return nil
}

func CreateFig(form *multipart.Form, jsonString string) ([]model.FigImage, *errors.CustomError) {
	decodeMeaService := service.DecodeMeaService{
		Form:       form,
		JsonString: jsonString,
	}
	requestModel, customErr := decodeMeaService.HandleRequest()
	if customErr != nil {
		return nil, customErr
	}
	images, err := service.FigDispatch(requestModel)
	if err != nil {
		return nil, err
	}
	return images, nil
}
