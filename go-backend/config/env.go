package config

import (
	"os"
	"strconv"
)

type Env struct {
	MYSQL_ROOT_PASSWORD string
	MYSQL_HOST          string
	MYSQL_PORT          int
	MYSQL_DB            string
	MINIO_HOST          string
	MINIO_ROOT_USER     string
	MINIO_ROOT_PASSWORD string
}

func ParseEnv(env *Env) {
	pass, ok := os.LookupEnv("MYSQL_ROOT_PASSWORD")
	if !ok {
		pass = "root_pass"
	}

	host, ok := os.LookupEnv("MYSQL_HOST")
	if !ok {
		host = "localhost"
	}

	port, ok := os.LookupEnv("MYSQL_PORT")
	if !ok {
		port = "3306"
	}
	port_int, _ := strconv.Atoi(port)

	dbName, ok := os.LookupEnv("MYSQL_DB")
	if !ok {
		dbName = "mea_db"
	}

	minioHost, ok := os.LookupEnv("MINIO_HOST")
	if !ok {
		minioHost = "localhost"
	}
	minioRootUser, ok := os.LookupEnv("MINIO_ROOT_USER")
	if !ok {
		minioRootUser = "minio_admin"
	}

	minioRootPassword, ok := os.LookupEnv("MINIO_ROOT_PASSWORD")
	if !ok {
		minioRootPassword = "minio_pass"
	}

	env.MYSQL_ROOT_PASSWORD = pass
	env.MYSQL_HOST = host
	env.MYSQL_PORT = port_int
	env.MYSQL_DB = dbName
	env.MINIO_HOST = minioHost
	env.MINIO_ROOT_USER = minioRootUser
	env.MINIO_ROOT_PASSWORD = minioRootPassword

}
