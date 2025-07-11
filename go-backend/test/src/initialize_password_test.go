package test

import (
	"encoding/json"
	"fmt"
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

func TestInitializePasswordNormal(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := router.SetupRouter()
	db.ConnectDB()
	defer db.DB.Close()

	// テストケース
	testCases := []struct {
		name           string
		expectedStatus int
		requestUser    *model.User // リクエストを行うユーザー
		targetUser     *model.User // 初期化対象のユーザー
	}{
		{
			name:           "システム管理者がユーザーのパスワードを初期化",
			expectedStatus: http.StatusOK,
			requestUser:    &model.User{Name: "sys_admin_init", Email: "sys_admin_init@example.com", Password: "password", Role: enum.SystemAdmin},
			targetUser:     &model.User{Name: "target_user_init", Email: "target_user_init@example.com", Password: "old_password", Role: enum.AppUser},
		},
		{
			name:           "管理者がユーザーのパスワードを初期化",
			expectedStatus: http.StatusOK,
			requestUser:    &model.User{Name: "admin_init", Email: "admin_init@example.com", Password: "password", Role: enum.Admin},
			targetUser:     &model.User{Name: "target_user_init_2", Email: "target_user_init_2@example.com", Password: "old_password_2", Role: enum.AppUser},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// リクエストユーザーと対象ユーザーをDBに保存
			db.DB.Create(testCase.requestUser)
			db.DB.Create(testCase.targetUser)

			// JWTトークンを生成
			token, _ := auth.GenerateJWT(testCase.requestUser.ID)

			req, _ := http.NewRequest("PUT", fmt.Sprintf("/user/initialize-password/%d", testCase.targetUser.ID), nil)
			req.Header.Set("Authorization", "Bearer "+token)

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, testCase.expectedStatus, w.Code)

			var responseBody map[string]interface{}
			json.Unmarshal(w.Body.Bytes(), &responseBody)
			assert.Contains(t, responseBody, "new_password")
			newPassword := responseBody["new_password"].(string)
			assert.NotEmpty(t, newPassword)

			// DBからユーザーを取得して新しいパスワードを検証
			var userInDB model.User
			db.DB.Where("id = ?", testCase.targetUser.ID).First(&userInDB)
			assert.Equal(t, newPassword, userInDB.Password)
		})
	}
}

func TestInitializePasswordAbnormal(t *testing.T) {
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
		targetUser     *model.User // 初期化対象のユーザー
	}{
		{
			name:           "一般ユーザーがパスワードを初期化しようとする",
			expectedStatus: http.StatusForbidden,
			errorCode:      "C-011",
			errorMessage:   "ログインユーザーにはこの操作の権限が存在しません",
			requestUser:    &model.User{Name: "app_user_init", Email: "app_user_init@example.com", Password: "password", Role: enum.AppUser},
			targetUser:     &model.User{Name: "target_user_init_3", Email: "target_user_init_3@example.com", Password: "old_password_3", Role: enum.AppUser},
		},
		{
			name:           "存在しないユーザーのパスワードを初期化しようとする",
			expectedStatus: http.StatusNotFound,
			errorCode:      "C-006",
			errorMessage:   "ユーザーが見つかりません",
			requestUser:    &model.User{Name: "sys_admin_init_2", Email: "sys_admin_init_2@example.com", Password: "password", Role: enum.SystemAdmin},
			targetUser:     &model.User{Name: "non_existent_init", Email: "non_existent_init@example.com", Password: "password", Role: enum.AppUser},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// リクエストユーザーをDBに保存
			db.DB.Create(testCase.requestUser)

			// JWTトークンを生成
			token, _ := auth.GenerateJWT(testCase.requestUser.ID)

			// 存在しないユーザーの場合はIDを直接指定
			targetUserID := testCase.targetUser.ID
			if testCase.targetUser.ID == 9999 {
				targetUserID = 9999
			} else {
				db.DB.Create(testCase.targetUser)
			}

			req, _ := http.NewRequest("PUT", fmt.Sprintf("/user/initialize-password/%d", targetUserID), nil)
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
