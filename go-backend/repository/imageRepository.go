package repository

import (
	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/model"
)

type ImageRepository struct {
	TableName enum.ImageTable
}

func (repo *ImageRepository) GetImages(getImageRequest *model.GetImageRequest) []model.Image {
	var images []model.Image
	db.DB.Table(repo.TableName.String()).Where("file_name = ?", getImageRequest.FileName).Scan(&images)
	return images
}

func (repo *ImageRepository) DeleteImage(deleteRequest *model.DeleteRequest) error {
	if err := db.DB.Table(repo.TableName.String()).Where("image_url=?", deleteRequest.ImageURL).Delete(nil).Error; err != nil {
		return err
	}
	return nil
}

func (repo *ImageRepository) DeleteAllImages(deleteAllRequest *model.DeleteAllRequest) error {
	if err := db.DB.Table(repo.TableName.String()).Where("file_name=?", deleteAllRequest.FileName).Delete(nil).Error; err != nil {
		return err
	}
	DeleteObjectsInDirectory(deleteAllRequest.Directory)
	return nil
}
