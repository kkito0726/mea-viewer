package repository

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"net/url"
	"strings"
	"time"

	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/minio/minio-go/v7"
)

const BUCKET_NAME = "plot-figure"

func SaveImage(fileType string, imageBuf *bytes.Buffer, fileName string) (string, error) {
	ensureBucketExists(BUCKET_NAME)

	now := time.Now().Format("2006-01-02-15-04-05")
	objName := fmt.Sprintf("images/%s/%s_%s_%s.png", fileType, fileName, fileType, now)

	_, err := db.MinioClient.PutObject(
		context.Background(),
		BUCKET_NAME,
		objName,
		imageBuf,
		int64(imageBuf.Len()),
		minio.PutObjectOptions{ContentType: "image/png"},
	)
	if err != nil {
		return "", err
	}

	imageURL := fmt.Sprintf("http://localhost:9000/%s/%s", BUCKET_NAME, objName)
	return imageURL, nil
}

func DeleteFile(url string) error {
	minioModel, err := extractBucketAndObject(url)
	if err != nil {
		return err
	}

	err = db.MinioClient.RemoveObject(context.Background(), minioModel.BucketName, minioModel.ObjectName, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("error removing object: %v", err)
	}
	return nil
}

func DeleteObjectsInDirectory(directory string) error {
	objectCh := db.MinioClient.ListObjects(context.Background(), BUCKET_NAME, minio.ListObjectsOptions{
		Prefix:    directory,
		Recursive: true,
	})

	for obj := range objectCh {
		if obj.Err != nil {
			return fmt.Errorf("error listing objects: %v", obj.Err)
		}
		err := db.MinioClient.RemoveObject(context.Background(), BUCKET_NAME, obj.Key, minio.RemoveObjectOptions{})
		if err != nil {
			return fmt.Errorf("error deleting objects: %v", err)
		}
	}
	return nil
}

func ensureBucketExists(bucketName string) {
	exists, err := db.MinioClient.BucketExists(context.Background(), bucketName)
	if err != nil {
		log.Fatalln(err)
	}
	if !exists {
		err = db.MinioClient.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Fatalln(err)
		}
	}
}

func extractBucketAndObject(rawURL string) (*model.MinioModel, error) {
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		return nil, err
	}

	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		return nil, fmt.Errorf("invalid URL scheme. Only 'http' and 'https' schemes are supported")
	}

	parts := strings.SplitN(parsedURL.Path, "/", 3)
	if len(parts) < 3 {
		return nil, fmt.Errorf("invalid URL format. Bucket name and object name are missing")
	}

	minioModel := model.MinioModel{
		BucketName: parts[1],
		ObjectName: parts[2],
	}

	return &minioModel, nil
}
