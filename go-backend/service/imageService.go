package service

import (
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

func NewImageService(tableName enum.ImageTable) *ImageService {
	return &ImageService{
		ImageRepository: &repository.ImageRepository{
			TableName: tableName,
		},
	}
}

type ImageService struct {
	ImageRepository *repository.ImageRepository
}

func (s *ImageService) GetImages(getImageRequest *model.GetImageRequest) []model.Image {
	return s.ImageRepository.GetImages(getImageRequest)
}

func (s *ImageService) DeleteImage(deleteRequest *model.DeleteRequest) *errors.CustomError {
	if err := repository.DeleteFile(deleteRequest.ImageURL); err != nil {
		return errors.ServerError(enum.F001)
	}
	if err := s.ImageRepository.DeleteImage(deleteRequest); err != nil {
		return errors.ServerError(enum.F002)
	}
	return nil
}

func (s *ImageService) DeleteAllImage(deleteAllImage *model.DeleteAllRequest) *errors.CustomError {
	if err := repository.DeleteObjectsInDirectory(deleteAllImage.Directory); err != nil {
		return errors.ServerError(enum.F001)
	}
	if err := s.ImageRepository.DeleteAllImages(deleteAllImage); err != nil {
		return errors.ServerError(enum.F002)
	}
	return nil
}
