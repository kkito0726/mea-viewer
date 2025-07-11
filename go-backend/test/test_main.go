package test

import (
	"os"
	"testing"

	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/model"
)

func TestMain(m *testing.M) {
	db.ConnectDB()
	defer db.DB.Close()
	db.Migrate()

	code := m.Run()

	os.Exit(code)
}

func ClearTable() {
	db.DB.Unscoped().Delete(&model.User{})
	db.DB.Unscoped().Delete(&model.UserAuthToken{})
}
