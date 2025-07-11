package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/auth"
	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/router"
	"github.com/kkito0726/mea-viewer/test"
	"github.com/stretchr/testify/assert"
)

func TestResetPasswordNormal(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := router.SetupRouter()
	db.ConnectDB()
	defer db.DB.Close()

	// テストケース
	testCases := []struct {
		name           string
		requestBody    gin.H
		expectedStatus int
		requestUser    *model.User // リクエストを行うユーザー
	}{
		{
			name:           "正常なパスワード再設定",
			requestBody:    gin.H{"current_password": "password", "new_password": "new_password"},
			expectedStatus: http.StatusOK,
			requestUser:    &model.User{Name: "reset_user", Email: "reset_user@example.com", Password: "password", Role: enum.AppUser},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// リクエストユーザーをDBに保存
			db.DB.Create(testCase.requestUser)

			// JWTトークンを生成
			token, _ := auth.GenerateJWT(testCase.requestUser.ID)

			jsonValue, _ := json.Marshal(testCase.requestBody)
			req, _ := http.NewRequest("PUT", "/user/password", bytes.NewBuffer(jsonValue))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+token)

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, testCase.expectedStatus, w.Code)

			// DBからユーザーを取得して新しいパスワードを検証
			var userInDB model.User
			db.DB.Where("id = ?", testCase.requestUser.ID).First(&userInDB)
			assert.Equal(t, testCase.requestBody["new_password"], userInDB.Password)
		})
	}
}

func TestResetPasswordAbnormal(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := router.SetupRouter()
	db.ConnectDB()
	defer db.DB.Close()

	// テストケース
	testCases := []struct {
		name           string
		requestBody    gin.H
		expectedStatus int
		errorCode      string
		errorMessage   string
		requestUser    *model.User // リクエストを行うユーザー
	}{
		{
			name:           "現在のパスワードが不一致",
			requestBody:    gin.H{"current_password": "wrong_password", "new_password": "new_password"},
			expectedStatus: http.StatusBadRequest,
			errorCode:      "C-012",
			errorMessage:   "パスワードが一致しません",
			requestUser:    &model.User{Name: "reset_user_2", Email: "reset_user_2@example.com", Password: "password", Role: enum.AppUser},
		},
		{
			name:           "無効なリクエストボディ",
			requestBody:    gin.H{"current_password": "", "new_password": ""},
			expectedStatus: http.StatusBadRequest,
			errorCode:      "C-001", // 例: バリデーションエラーのコード
			errorMessage:   "リクエストの形式が正しくありません",
			requestUser:    &model.User{Name: "reset_user_3", Email: "reset_user_3@example.com", Password: "password", Role: enum.AppUser},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// リクエストユーザーをDBに保存
			db.DB.Create(testCase.requestUser)

			// JWTトークンを生成
			token, _ := auth.GenerateJWT(testCase.requestUser.ID)

			jsonValue, _ := json.Marshal(testCase.requestBody)
			req, _ := http.NewRequest("PUT", "/user/password", bytes.NewBuffer(jsonValue))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+token)

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, testCase.expectedStatus, w.Code)

			var errorResponse gin.H
			json.Unmarshal(w.Body.Bytes(), &errorResponse)
			assert.Contains(t, errorResponse, "error")

			errMap := errorResponse["error"].(map[string]interface{})
			assert.Equal(t, float64(testCase.expectedStatus), errMap["status_code"])
			assert.Equal(t, testCase.errorCode, errMap["error_code"])
			assert.Equal(t, testCase.errorMessage, errMap["message"])
		})
	}
}
