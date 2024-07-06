package repository

import (
	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/model"
)

type ImageRepository struct {
	TableName string
}

func (repo *ImageRepository) GetImages(getImageRequest *model.GetImageRequest) []model.Image {
	var images []model.Image
	db.DB.Table(repo.TableName).Where("file_name = ?", getImageRequest.FileName).Scan(&images)
	return images
}

func (repo *ImageRepository) DeleteImage(deleteRequest *model.DeleteRequest) {
	db.DB.Table(repo.TableName).Where("image_url=?", deleteRequest.ImageURL).Delete(nil)
	DeleteFile(deleteRequest.ImageURL)
}

func (repo *ImageRepository) DeleteAllImages(deleteAllRequest *model.DeleteAllRequest) {
	db.DB.Table(repo.TableName).Where("file_name=?", deleteAllRequest.FileName).Delete(nil)
	DeleteObjectsInDirectory(deleteAllRequest.Directory)
}
