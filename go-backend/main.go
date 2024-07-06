package main

import (
	"fmt"

	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/router"
)

func main() {
	db := db.DB
	defer db.Close()

	router := router.SetupRouter()

	port := 8080
	url := fmt.Sprintf("http://localhost:%d", port)
	fmt.Println(url)
	router.Run(fmt.Sprintf(":%d", port))
}
