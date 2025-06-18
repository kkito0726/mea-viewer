package repository

import (
	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/model"
)

type ImageRepository struct{}

func (repo *ImageRepository) CreateImage(image *model.FigImage) error {
	return db.DB.Create(image).Error
}

func (repo *ImageRepository) GetImages(getImageRequest *model.GetImageRequest) ([]model.FigImage, error) {
	var images []model.FigImage
	if err := db.DB.Where("fig_type = ? AND file_name = ?", getImageRequest.FigType, getImageRequest.FileName).Order("created_at ASC").Find(&images).Error; err != nil {
		return nil, err
	}
	return images, nil
}

func (repo *ImageRepository) DeleteImage(deleteRequest *model.DeleteRequest) error {
	if err := db.DB.Unscoped().Where("image_url=?", deleteRequest.ImageURL).Delete(&model.FigImage{}).Error; err != nil {
		return err
	}
	return nil
}

func (repo *ImageRepository) DeleteAllImages(figType string, filename string) error {
	if err := db.DB.Unscoped().Where("fig_type = ? AND file_name = ?", figType, filename).Delete(&model.FigImage{}).Error; err != nil {
		return err
	}
	return nil
}
