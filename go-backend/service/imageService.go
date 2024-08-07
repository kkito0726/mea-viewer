package service

import (
	"bytes"
	"image/png"

	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

func NewImageService(tableName enum.ImageTable, minioRepository repository.MinioRepository) *ImageService {
	return &ImageService{
		ImageRepository: &repository.ImageRepository{
			TableName: tableName,
		},
		MinioRepository: &minioRepository,
	}
}

type ImageService struct {
	ImageRepository *repository.ImageRepository
	MinioRepository *repository.MinioRepository
}

func (s *ImageService) CreateImage(f lib.PlotMethod, formDto *model.FormDto) (*model.Image, *errors.CustomError) {
	// Figの描画
	img, err := f(formDto.FormValue)
	if err != nil {
		return nil, errors.ServerError(enum.F008)
	}
	buf := new(bytes.Buffer)
	if err := png.Encode(buf, img.Image()); err != nil {
		return nil, errors.ServerError(enum.F005)
	}

	// minioへの保存
	imageUrl, err := s.MinioRepository.SaveImage(buf, formDto)
	if err != nil {
		return nil, errors.ServerError(enum.F003)
	}

	// DBへレコードInsert
	image := &model.Image{ImageUrl: imageUrl, FileName: formDto.FileName, Ch: formDto.Ch}
	if err := s.ImageRepository.CreateImage(image); err != nil {
		return nil, errors.ServerError(enum.F004)
	}

	return image, nil
}

func (s *ImageService) GetImages(getImageRequest *model.GetImageRequest) []model.Image {
	return s.ImageRepository.GetImages(getImageRequest)
}

func (s *ImageService) DeleteImage(deleteRequest *model.DeleteRequest) *errors.CustomError {
	if err := s.MinioRepository.DeleteFile(deleteRequest.ImageURL); err != nil {
		return errors.ServerError(enum.F001)
	}
	if err := s.ImageRepository.DeleteImage(deleteRequest); err != nil {
		return errors.ServerError(enum.F002)
	}
	return nil
}

func (s *ImageService) DeleteAllImage(deleteAllImage *model.DeleteAllRequest) *errors.CustomError {
	if err := s.MinioRepository.DeleteObjectsInDirectory(deleteAllImage.Directory); err != nil {
		return errors.ServerError(enum.F001)
	}
	if err := s.ImageRepository.DeleteAllImages(deleteAllImage); err != nil {
		return errors.ServerError(enum.F002)
	}
	return nil
}
