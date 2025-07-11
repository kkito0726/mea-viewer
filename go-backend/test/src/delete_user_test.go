package test

import (
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

func TestDeleteUserNormal(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := router.SetupRouter()
	db.ConnectDB()
	defer db.DB.Close()

	// テストケース
	testCases := []struct {
		name           string
		expectedStatus int
		requestUser    *model.User // リクエストを行うユーザー
	}{
		{
			name:           "正常なユーザー削除",
			expectedStatus: http.StatusNoContent,
			requestUser:    &model.User{Name: "delete_user", Email: "delete_user@example.com", Password: "password", Role: enum.AppUser},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// リクエストユーザーをDBに保存
			db.DB.Create(testCase.requestUser)

			// JWTトークンを生成
			token, _ := auth.GenerateJWT(testCase.requestUser.ID)
			db.DB.Create(&model.UserAuthToken{UserID: testCase.requestUser.ID, Token: token})

			req, _ := http.NewRequest("DELETE", "/user", nil)
			req.Header.Set("Authorization", "Bearer "+token)

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, testCase.expectedStatus, w.Code)

			// DBからユーザーが削除されていることを検証
			var userInDB model.User
			err := db.DB.Where("id = ?", testCase.requestUser.ID).First(&userInDB).Error
			assert.Error(t, err) // ユーザーが見つからないことを期待

			// DBからトークンが削除されていることを検証
			var userAuthTokenInDB model.UserAuthToken
			err = db.DB.Where("user_id = ?", testCase.requestUser.ID).First(&userAuthTokenInDB).Error
			assert.Error(t, err) // トークンが見つからないことを期待
		})
	}
}

func TestDeleteUserAbnormal(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := router.SetupRouter()
	db.ConnectDB()
	defer db.DB.Close()

	// テストケース
	testCases := []struct {
		name           string
		expectedStatus int
		errorCode      string
		errorMessage   string
		requestUser    *model.User // リクエストを行うユーザー
		token          string      // リクエストに含めるトークン
	}{
		{
			name:           "無効なトークン",
			expectedStatus: http.StatusUnauthorized,
			errorCode:      "C-007",
			errorMessage:   "認証情報が切れています。再度ログインしてください",
			requestUser:    &model.User{Name: "invalid_token_user_del", Email: "invalid_token_user_del@example.com", Password: "password", Role: enum.AppUser},
			token:          "invalid_token",
		},
		{
			name:           "トークンなし",
			expectedStatus: http.StatusUnauthorized,
			errorCode:      "C-007",
			errorMessage:   "認証情報が切れています。再度ログインしてください",
			requestUser:    &model.User{Name: "no_token_user_del", Email: "no_token_user_del@example.com", Password: "password", Role: enum.AppUser},
			token:          "",
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// リクエストユーザーをDBに保存
			db.DB.Create(testCase.requestUser)

			// JWTトークンを生成 (有効なトークンを生成し、DBに保存)
			validToken, _ := auth.GenerateJWT(testCase.requestUser.ID)
			db.DB.Create(&model.UserAuthToken{UserID: testCase.requestUser.ID, Token: validToken})

			req, _ := http.NewRequest("DELETE", "/user", nil)
			if testCase.token != "" {
				req.Header.Set("Authorization", "Bearer "+testCase.token)
			}

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
