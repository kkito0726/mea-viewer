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

func TestCreateUserNormal(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := router.SetupRouter()

	// テストケース
	testCases := []struct {
		name           string
		requestBody    gin.H
		expectedStatus int
		expectedName   string
		expectedEmail  string
		expectedRole   enum.Role
		requestUser    *model.User // リクエストを行うユーザー
	}{
		{
			name:           "システム管理者でアプリユーザー作成できる",
			requestBody:    gin.H{"name": "test_user_1", "email": "test1@example.com", "role": enum.AppUser},
			expectedStatus: http.StatusOK,
			expectedName:   "test_user_1",
			expectedEmail:  "test1@example.com",
			expectedRole:   enum.AppUser,
			requestUser:    &model.User{Name: "sys_admin", Email: "sys_admin@example.com", Password: "password", Role: enum.SystemAdmin},
		},
		{
			name:           "管理者でアプリユーザー作成できる",
			requestBody:    gin.H{"name": "test_user_2", "email": "test2@example.com", "role": enum.AppUser},
			expectedStatus: http.StatusOK,
			expectedName:   "test_user_2",
			expectedEmail:  "test2@example.com",
			expectedRole:   enum.AppUser,
			requestUser:    &model.User{Name: "admin", Email: "admin@example.com", Password: "password", Role: enum.Admin},
		},
		{
			name:           "一般ユーザーでユーザー作成できない",
			requestBody:    gin.H{"name": "test_user_3", "email": "test3@example.com", "role": enum.AppUser},
			expectedStatus: http.StatusForbidden,
			expectedName:   "",
			expectedEmail:  "",
			expectedRole:   "",
			requestUser:    &model.User{Name: "app_user", Email: "app_user@example.com", Password: "password", Role: enum.AppUser},
		},
		{
			name:           "無効なリクエストボディ",
			requestBody:    gin.H{"name": "", "email": "invalid-email", "role": enum.AppUser},
			expectedStatus: http.StatusBadRequest,
			expectedName:   "",
			expectedEmail:  "",
			expectedRole:   "",
			requestUser:    &model.User{Name: "sys_admin_2", Email: "sys_admin_2@example.com", Password: "password", Role: enum.SystemAdmin},
		},
		{
			name:           "重複するメールアドレス",
			requestBody:    gin.H{"name": "test_user_4", "email": "same_address@example.com", "role": enum.AppUser},
			expectedStatus: http.StatusConflict,
			expectedName:   "",
			expectedEmail:  "",
			expectedRole:   "",
			requestUser:    &model.User{Name: "sys_admin_3", Email: "same_address@example.com", Password: "password", Role: enum.SystemAdmin},
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
			req, _ := http.NewRequest("POST", "/user", bytes.NewBuffer(jsonValue))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+token)

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, testCase.expectedStatus, w.Code)

			if testCase.expectedStatus == http.StatusOK {
				var responseUser model.UserResponse
				json.Unmarshal(w.Body.Bytes(), &responseUser)

				assert.Equal(t, testCase.expectedName, responseUser.Name)
				assert.Equal(t, testCase.expectedEmail, responseUser.Email)
				assert.Equal(t, testCase.expectedRole, responseUser.Role)
				assert.NotEmpty(t, responseUser.Password)
				assert.NotEmpty(t, responseUser.Token)

				// DBからユーザーを取得して検証
				var userInDB model.User
				db.DB.Where("email = ?", testCase.expectedEmail).First(&userInDB)
				assert.Equal(t, testCase.expectedName, userInDB.Name)
				assert.Equal(t, testCase.expectedEmail, userInDB.Email)
				assert.Equal(t, testCase.expectedRole, userInDB.Role)
				assert.Equal(t, responseUser.Password, userInDB.Password)

				// DBからトークンを取得して検証
				var userAuthTokenInDB model.UserAuthToken
				db.DB.Where("user_id = ?", userInDB.ID).First(&userAuthTokenInDB)
				assert.Equal(t, responseUser.Token, userAuthTokenInDB.Token)

			} else {
				// エラーレスポンスの検証（オプション）
				var errorResponse map[string]interface{}
				json.Unmarshal(w.Body.Bytes(), &errorResponse)
				assert.Contains(t, errorResponse, "error")
			}
		})
	}
}
