package service

import (
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

type ImageService struct {
	ImageRepository *repository.ImageRepository
}

func (s *ImageService) GetImages(getImageRequest *model.GetImageRequest) []model.Image {
	return s.ImageRepository.GetImages(getImageRequest)
}

func (s *ImageService) DeleteImage(deleteImageRequest *model.DeleteRequest) {
	s.ImageRepository.DeleteImage(deleteImageRequest)
}

func (s *ImageService) DeleteAllImage(deleteAllImage *model.DeleteAllRequest) {
	s.ImageRepository.DeleteAllImages(deleteAllImage)
}
