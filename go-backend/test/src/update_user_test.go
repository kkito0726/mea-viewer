package test

import (
	"bytes"
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
	"gorm.io/gorm"
)

func TestUpdateUserNormal(t *testing.T) {
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
		requestUser    *model.User // リクエストを行うユーザー
		targetUser     *model.User // 更新対象のユーザー
	}{
		{
			name:           "自身の情報を更新（名前とメールアドレス）",
			requestBody:    gin.H{"name": "updated_name", "email": "updated_email@example.com"},
			expectedStatus: http.StatusOK,
			expectedName:   "updated_name",
			expectedEmail:  "updated_email@example.com",
			expectedRole:   enum.AppUser,
			requestUser:    &model.User{Name: "user_to_update", Email: "user_to_update@example.com", Password: "password", Role: enum.AppUser},
			targetUser:     nil, // 自身を更新するためnil
		},
		{
			name:           "システム管理者が他のユーザーのロールをAdminに更新",
			requestBody:    gin.H{"role": enum.Admin},
			expectedStatus: http.StatusOK,
			expectedName:   "other_user",
			expectedEmail:  "other_user@example.com",
			expectedRole:   enum.Admin,
			requestUser:    &model.User{Name: "sys_admin_update", Email: "sys_admin_update@example.com", Password: "password", Role: enum.SystemAdmin},
			targetUser:     &model.User{Name: "other_user", Email: "other_user@example.com", Password: "password", Role: enum.AppUser},
		},
		{
			name:           "管理者が他のユーザーのロールをAppUserに更新",
			requestBody:    gin.H{"role": enum.AppUser},
			expectedStatus: http.StatusOK,
			expectedName:   "another_user",
			expectedEmail:  "another_user@example.com",
			expectedRole:   enum.AppUser,
			requestUser:    &model.User{Name: "admin_update", Email: "admin_update@example.com", Password: "password", Role: enum.Admin},
			targetUser:     &model.User{Name: "another_user", Email: "another_user@example.com", Password: "password", Role: enum.Admin},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// リクエストユーザーをDBに保存
			db.DB.Create(testCase.requestUser)

			// 更新対象ユーザーをDBに保存 (自身を更新する場合はスキップ)
			var actualTargetUser *model.User
			if testCase.targetUser != nil {
				db.DB.Create(testCase.targetUser)
				actualTargetUser = testCase.targetUser
			} else {
				actualTargetUser = testCase.requestUser
			}

			// JWTトークンを生成
			token, _ := auth.GenerateJWT(testCase.requestUser.ID)

			jsonValue, _ := json.Marshal(testCase.requestBody)
			req, _ := http.NewRequest("PUT", fmt.Sprintf("/user/%d", actualTargetUser.ID), bytes.NewBuffer(jsonValue))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+token)

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, testCase.expectedStatus, w.Code)

			var responseUser model.UserResponse
			json.Unmarshal(w.Body.Bytes(), &responseUser)

			assert.Equal(t, testCase.expectedName, responseUser.Name)
			assert.Equal(t, testCase.expectedEmail, responseUser.Email)
			assert.Equal(t, testCase.expectedRole, responseUser.Role)

			// DBからユーザーを取得して検証
			var userInDB model.User
			db.DB.Where("id = ?", actualTargetUser.ID).First(&userInDB)
			assert.Equal(t, testCase.expectedName, userInDB.Name)
			assert.Equal(t, testCase.expectedEmail, userInDB.Email)
			assert.Equal(t, testCase.expectedRole, userInDB.Role)
		})
	}
}

func TestUpdateUserAbnormal(t *testing.T) {
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
		targetUser     *model.User // 更新対象のユーザー
	}{
		{
			name:           "一般ユーザーが他のユーザーの情報を更新しようとする",
			requestBody:    gin.H{"name": "updated_name", "email": "test@example.com", "password": "password", "role": "app_user"},
			expectedStatus: http.StatusForbidden,
			errorCode:      "C-007",
			errorMessage:   "認証情報が切れています。再度ログインしてください",
			requestUser:    &model.User{Name: "app_user_update", Email: "app_user_update@example.com", Password: "password", Role: enum.AppUser},
			targetUser:     &model.User{Name: "other_user_2", Email: "other_user_2@example.com", Password: "password", Role: enum.AppUser},
		},
		{
			name:           "管理者が他のユーザーのロールをSystemAdminに更新しようとする",
			requestBody:    gin.H{"name": "updated_name", "email": "test@example.com", "password": "password", "role": "system_admin"},
			expectedStatus: http.StatusForbidden,
			errorCode:      "C-007",
			errorMessage:   "認証情報が切れています。再度ログインしてください",
			requestUser:    &model.User{Name: "admin_update_2", Email: "admin_update_2@example.com", Password: "password", Role: enum.Admin},
			targetUser:     &model.User{Name: "other_user_3", Email: "other_user_3@example.com", Password: "password", Role: enum.AppUser},
		},
		{
			name:           "存在しないユーザーを更新しようとする",
			requestBody:    gin.H{"name": "non_existent", "email": "non_existent@example.com", "password": "password", "role": "system_admin"},
			expectedStatus: http.StatusNotFound,
			errorCode:      "C-006",
			errorMessage:   "ユーザーが見つかりませんでした",
			requestUser:    &model.User{Name: "sys_admin_update_2", Email: "sys_admin_update_2@example.com", Password: "password", Role: enum.SystemAdmin},
			targetUser:     &model.User{Model: gorm.Model{ID: 9999}, Name: "sys_admin__", Email: "sys@example.com", Password: "password", Role: enum.SystemAdmin},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			test.ClearTable()

			// リクエストユーザーをDBに保存
			db.DB.Create(testCase.requestUser)

			// 更新対象ユーザーをDBに保存 (存在しないユーザーの場合はスキップ)
			var actualTargetUserID uint
			if testCase.targetUser != nil && testCase.targetUser.ID != 9999 {
				db.DB.Create(testCase.targetUser)
				actualTargetUserID = testCase.targetUser.ID
			} else if testCase.targetUser != nil && testCase.targetUser.ID == 9999 {
				actualTargetUserID = 9999
			} else {
				actualTargetUserID = testCase.requestUser.ID
			}

			// JWTトークンを生成
			token, _ := auth.GenerateJWT(testCase.requestUser.ID)

			jsonValue, _ := json.Marshal(testCase.requestBody)
			req, _ := http.NewRequest("PUT", fmt.Sprintf("/user/%d", actualTargetUserID), bytes.NewBuffer(jsonValue))
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
