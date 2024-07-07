package db

import (
	"fmt"
	"log"

	"github.com/kkito0726/mea-viewer/config"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var MinioClient *minio.Client

func init() {
	env := config.Env{}
	config.ParseEnv(&env)

	endpoint := fmt.Sprintf("%s:9000", env.MINIO_HOST)
	accessKeyID := env.MINIO_ROOT_USER
	secretAccessKey := env.MINIO_ROOT_PASSWORD
	useSSL := false

	// Minioクライアントを初期化
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalln(err)
	}

	MinioClient = minioClient
}
