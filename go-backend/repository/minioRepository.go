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

func SaveImage(imageBuf *bytes.Buffer, formDto *model.FormDto) (string, error) {
	ensureBucketExists(BUCKET_NAME)

	now := time.Now().Format("2006-01-02-15-04-05")
	objName := fmt.Sprintf("images/%s/%d_%s_%s_%s.png", formDto.FigType.String(), formDto.Ch, formDto.FileName, formDto.FigType.String(), now)

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

// DeleteFile はMinIOからファイルを削除する関数
func DeleteFile(urlStr string) error {
	minioModel, err := ExtractBucketAndObject(urlStr)
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

// ExtractBucketAndObject はURLからバケット名とオブジェクト名を抽出する関数
func ExtractBucketAndObject(urlStr string) (model.MinioModel, error) {
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		return model.MinioModel{}, fmt.Errorf("invalid URL: %v", err)
	}

	parts := parsedURL.Path[1:]
	splitParts := strings.SplitN(parts, "/", 2)
	if len(splitParts) < 2 {
		return model.MinioModel{}, fmt.Errorf("invalid URL format. Bucket name and object name are missing")
	}

	return model.MinioModel{
		BucketName: splitParts[0],
		ObjectName: splitParts[1],
	}, nil
}
