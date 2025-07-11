package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/router"
	"github.com/kkito0726/mea-viewer/test"
	"github.com/stretchr/testify/assert"
)

func TestLoginUserNormal(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := router.SetupRouter()
	db.ConnectDB()
	defer db.DB.Close()

	// テストケース
	testCases := []struct {
		name           string
		requestBody    gin.H
		expectedStatus int
		expectedName   string
		expectedEmail  string
		expectedRole   enum.Role
		userInDB       *model.User // DBに存在するユーザー
	}{
		{
			name:           "正常なログイン",
			requestBody:    gin.H{"email": "login_user@example.com", "password": "password"},
			expectedStatus: http.StatusOK,
			expectedName:   "login_user",
			expectedEmail:  "login_user@example.com",
			expectedRole:   enum.AppUser,
			userInDB:       &model.User{Name: "login_user", Email: "login_user@example.com", Password: "password", Role: enum.AppUser},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// ユーザーをDBに保存
			db.DB.Create(testCase.userInDB)

			jsonValue, _ := json.Marshal(testCase.requestBody)
			req, _ := http.NewRequest("POST", "/user/login", bytes.NewBuffer(jsonValue))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, testCase.expectedStatus, w.Code)

			var responseUser model.UserResponse
			json.Unmarshal(w.Body.Bytes(), &responseUser)

			assert.Equal(t, testCase.expectedName, responseUser.Name)
			assert.Equal(t, testCase.expectedEmail, responseUser.Email)
			assert.Equal(t, testCase.expectedRole, responseUser.Role)
			assert.NotEmpty(t, responseUser.Token)

			// DBからトークンを取得して検証
			var userAuthTokenInDB model.UserAuthToken
			db.DB.Where("user_id = ?", responseUser.ID).First(&userAuthTokenInDB)
			assert.Equal(t, responseUser.Token, userAuthTokenInDB.Token)
		})
	}
}

func TestLoginUserAbnormal(t *testing.T) {
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
		userInDB       *model.User // DBに存在するユーザー
	}{
		{
			name:           "存在しないユーザー",
			requestBody:    gin.H{"email": "non_existent@example.com", "password": "non/existent_password"},
			expectedStatus: http.StatusNotFound,
			errorCode:      "C-006",
			errorMessage:   "ユーザーが見つかりません",
			userInDB:       &model.User{Name: "login_user", Email: "login_user@example.com", Password: "password", Role: enum.AppUser},
		},
		{
			name:           "パスワード不一致",
			requestBody:    gin.H{"email": "wrong_password@example.com", "password": "wrong_password"},
			expectedStatus: http.StatusNotFound,
			errorCode:      "C-006",
			errorMessage:   "ユーザーが見つかりません",
			userInDB:       &model.User{Name: "wrong_password", Email: "wrong_password@example.com", Password: "password", Role: enum.AppUser},
		},
		{
			name:           "無効なリクエストボディ",
			requestBody:    gin.H{"email": "invalid-email", "password": ""},
			expectedStatus: http.StatusBadRequest,
			errorCode:      "C-001", // 例: バリデーションエラーのコード
			errorMessage:   "リクエストの形式が正しくありません",
			userInDB:       &model.User{Name: "login_user", Email: "login_user@example.com", Password: "password", Role: enum.AppUser},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			if testCase.userInDB != nil {
				db.DB.Create(testCase.userInDB)
			}

			jsonValue, _ := json.Marshal(testCase.requestBody)
			req, _ := http.NewRequest("POST", "/user/login", bytes.NewBuffer(jsonValue))
			req.Header.Set("Content-Type", "application/json")

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
