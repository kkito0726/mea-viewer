package repository

import (
	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/model"
)

type ImageRepository struct {
	TableName enum.ImageTable
}

func NewImageRepository(tableName enum.ImageTable) *ImageRepository {
	return &ImageRepository{TableName: tableName}
}

func (repo *ImageRepository) CreateImage(image *model.Image) error {
	return db.DB.Table(repo.TableName.String()).Create(image).Error
}

func (repo *ImageRepository) GetImages(getImageRequest *model.GetImageRequest) ([]model.FigImage, error) {
	var images []model.FigImage
	if err := db.DB.Where("fig_type = ? AND file_name = ?", getImageRequest.FigType, getImageRequest.FileName).Find(&images).Error; err != nil {
		return nil, err
	}
	return images, nil
}

func (repo *ImageRepository) DeleteImage(deleteRequest *model.DeleteRequest) error {
	if err := db.DB.Where("image_url=?", deleteRequest.ImageURL).Delete(&model.FigImage{}).Error; err != nil {
		return err
	}
	return nil
}

func (repo *ImageRepository) DeleteAllImages(deleteAllRequest *model.DeleteAllRequest) error {
	if err := db.DB.Where("fig_type = ? AND file_name = ?", deleteAllRequest.FigType, deleteAllRequest.FileName).Delete(&model.FigImage{}).Error; err != nil {
		return err
	}
	return nil
}
