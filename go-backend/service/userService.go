package service

import (
	"crypto/rand"
	"encoding/base64"
	"strconv"

	"github.com/kkito0726/mea-viewer/auth"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

var userDomainService = NewUserDomainService(&repository.UserRepository{})

type UserService struct {
	UserRepository *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{
		UserRepository: repo,
	}
}

func (s *UserService) CreateUser(requestUserID uint, requestToken string, createUserRequest *model.CreateUserRequest) (*model.UserResponse, *errors.CustomError) {
	// ロールチェック
	requestUser, err := s.UserRepository.GetUserById(requestUserID)
	if err != nil {
		return nil, errors.NotFoundError(enum.C006)
	}
	if requestUser.Role != enum.SystemAdmin && requestUser.Role != enum.Admin {
		return nil, errors.ForbiddenError(enum.C011)
	}

	// パスワードをランダムに生成
	b := make([]byte, 10)
	if _, err := rand.Read(b); err != nil {
		return nil, errors.ServerError(enum.C003)
	}
	password := base64.URLEncoding.EncodeToString(b)

	newUser := &model.User{
		Name:     createUserRequest.Name,
		Email:    createUserRequest.Email,
		Password: password,
		Role:     createUserRequest.Role,
	}

	// ユーザーの重複チェック
	if err := userDomainService.CheckUserConflict(newUser); err != nil {
		return nil, err
	}

	// Insert
	if err := s.UserRepository.CreateUser(newUser); err != nil {
		return nil, errors.ServerError(enum.C003)
	}

	// Token生成
	token, err := auth.GenerateJWT(newUser.ID)
	if err != nil {
		return nil, errors.ServerError(enum.C004)
	}

	// Token登録
	newUserAuthToken := model.UserAuthToken{
		UserID: newUser.ID,
		Token:  token,
	}
	if err := s.UserRepository.CreateUserToken(&newUserAuthToken); err != nil {
		return nil, errors.ServerError(enum.C005)
	}

	return &model.UserResponse{
		ID:       newUser.ID,
		Name:     newUser.Name,
		Email:    newUser.Email,
		Password: password,
		Token:    newUserAuthToken.Token,
	}, nil
}

func (s *UserService) LoginUser(req *model.LoginUserRequest) (*model.UserResponse, *errors.CustomError) {
	user, err := s.UserRepository.GetUser(req)
	if err != nil {
		return nil, errors.NotFoundError(enum.C006)
	}
	// Token生成
	token, err := auth.GenerateJWT(user.ID)
	if err != nil {
		return nil, errors.ServerError(enum.C004)
	}

	// Token登録
	newUserAuthToken := model.UserAuthToken{
		UserID: user.ID,
		Token:  token,
	}
	if err := s.UserRepository.CreateUserToken(&newUserAuthToken); err != nil {
		return nil, errors.ServerError(enum.C005)
	}
	return &model.UserResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Token: newUserAuthToken.Token,
	}, nil
}

func (s *UserService) LogoutUser(userID uint, token string) *errors.CustomError {
	if err := s.UserRepository.DeleteToken(&model.UserAuthToken{UserID: userID, Token: token}); err != nil {
		return errors.NotFoundError(enum.C008)
	}
	return nil
}

func (s *UserService) UpdateUser(requestUserID uint, requestToken string, updatedUser *model.User, targetUserIDStr string) (*model.UserResponse, *errors.CustomError) {
	// リクエスト元のユーザー情報を取得
	requestUser, err := s.UserRepository.GetUserById(requestUserID)
	if err != nil {
		return nil, errors.NotFoundError(enum.C006)
	}

	// 更新対象のユーザーIDを数値に変換
	targetUserID, convErr := strconv.ParseUint(targetUserIDStr, 10, 32)
	if convErr != nil {
		return nil, errors.BadRequestError(enum.C001)
	}

	// 更新対象のユーザー情報を取得
	targetUser, err := s.UserRepository.GetUserById(uint(targetUserID))
	if err != nil {
		return nil, errors.NotFoundError(enum.C006)
	}

	// 自分自身の情報を更新する場合
	if requestUser.ID == targetUser.ID {
		targetUser.Name = updatedUser.Name
		targetUser.Email = updatedUser.Email
		// 自身のロールがシステム管理者なら自身のロールを変更できる
		if requestUser.Role == enum.SystemAdmin {
			targetUser.Role = updatedUser.Role
		}
	} else { // 他のユーザーの情報を更新する場合
		// ロール更新権限チェック
		if requestUser.Role != enum.SystemAdmin && requestUser.Role != enum.Admin {
			return nil, errors.ForbiddenError(enum.C007)
		}

		// AdminがSystemAdminにロールを変更しようとした場合
		if requestUser.Role == enum.Admin && updatedUser.Role == enum.SystemAdmin {
			return nil, errors.ForbiddenError(enum.C007)
		}

		targetUser.Role = updatedUser.Role
	}

	// ユーザーの重複チェック
	if err := userDomainService.CheckUserConflict(targetUser); err != nil {
		return nil, err
	}

	// データベースに保存
	if err := s.UserRepository.UpdateUser(targetUser); err != nil {
		return nil, errors.ServerError(enum.C009)
	}

	return &model.UserResponse{
		ID:    targetUser.ID,
		Name:  targetUser.Name,
		Email: targetUser.Email,
		Role:  targetUser.Role,
		Token: requestToken,
	}, nil
}

func (s *UserService) DeleteUser(userID uint, token string) *errors.CustomError {
	if err := s.UserRepository.DeleteUser(userID); err != nil {
		return errors.ServerError(enum.C010)
	}
	return nil
}

func (s *UserService) UpdatePassword(userID uint, req *model.ResetPasswordRequest) *errors.CustomError {
	user, err := s.UserRepository.GetUserById(userID)
	if err != nil {
		return errors.NotFoundError(enum.C006)
	}

	// 現在のパスワードが一致するか確認
	if user.Password != req.CurrentPassword {
		return errors.BadRequestError(enum.C012) // C012: Invalid current password
	}

	// 新しいパスワードに更新
	user.Password = req.NewPassword
	if err := s.UserRepository.UpdateUser(user); err != nil {
		return errors.ServerError(enum.C009)
	}

	return nil
}

func (s *UserService) InitializePassword(requestUserID uint, targetUserIDStr string) (string, *errors.CustomError) {
	// ロールチェック
	requestUser, err := s.UserRepository.GetUserById(requestUserID)
	if err != nil {
		return "", errors.NotFoundError(enum.C006)
	}
	if requestUser.Role != enum.SystemAdmin && requestUser.Role != enum.Admin {
		return "", errors.ForbiddenError(enum.C011)
	}

	// 更新対象のユーザーIDを数値に変換
	targetUserID, convErr := strconv.ParseUint(targetUserIDStr, 10, 32)
	if convErr != nil {
		return "", errors.BadRequestError(enum.C001)
	}

	// 対象ユーザーの情報を取得
	targetUser, err := s.UserRepository.GetUserById(uint(targetUserID))
	if err != nil {
		return "", errors.NotFoundError(enum.C006)
	}

	// パスワードをランダムに生成
	b := make([]byte, 10)
	if _, err := rand.Read(b); err != nil {
		return "", errors.ServerError(enum.C003)
	}
	newPassword := base64.URLEncoding.EncodeToString(b)

	// パスワードを更新
	targetUser.Password = newPassword
	if err := s.UserRepository.UpdateUser(targetUser); err != nil {
		return "", errors.ServerError(enum.C009)
	}

	return newPassword, nil
}
