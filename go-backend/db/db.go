package db

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/kkito0726/mea-viewer/config"
	"github.com/kkito0726/mea-viewer/model"
)

var DB *gorm.DB

func ConnectDB() {
	env := config.Env{}
	config.ParseEnv(&env)
	connectInfo := fmt.Sprintf(
		"%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local",
		"root",
		env.MYSQL_ROOT_PASSWORD,
		env.MYSQL_HOST,
		env.MYSQL_PORT,
		env.MYSQL_DB,
	)
	fmt.Println(env.MYSQL_HOST)
	dbConn, err := gorm.Open("mysql", connectInfo)
	if err != nil {
		log.Fatalf("Got error when connect database, the error is '%v'", err)
	}
	DB = dbConn
}

func Migrate() {
	DB.AutoMigrate(&model.User{})
	DB.AutoMigrate(&model.UserAuthToken{})
	DB.AutoMigrate(&model.FigImage{})
}
