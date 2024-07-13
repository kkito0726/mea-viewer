package service

import (
	"errors"

	"github.com/kkito0726/mea-viewer/auth"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

type UserService struct {
	UserRepository *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{
		UserRepository: repo,
	}
}

func (s *UserService) CreateUser(newUser *model.User) (*model.UserResponse, error) {
	// ユーザーネームの重複確認
	if s.UserRepository.FindNameExist(newUser.Name) {
		return nil, errors.New("name already exists")
	}

	// emailの重複確認
	if s.UserRepository.FindEmailExist(newUser.Email) {
		return nil, errors.New("name already exists")
	}

	// Insert
	if err := s.UserRepository.CreateUser(newUser); err != nil {
		return nil, err
	}

	// Token生成
	token, err := auth.GenerateJWT(newUser.ID)
	if err != nil {
		return nil, err
	}

	// Token登録
	newUserAuthToken := model.UserAuthToken{
		UserID: newUser.ID,
		Token:  token,
	}
	if err := s.UserRepository.CreateUserToken(&newUserAuthToken); err != nil {
		return nil, err
	}

	return &model.UserResponse{
		ID:    newUser.ID,
		Name:  newUser.Name,
		Email: newUser.Email,
		Token: newUserAuthToken.Token,
	}, nil
}

func (s *UserService) LoginUser(req *model.LoginUserRequest) (*model.UserResponse, error) {
	user, err := s.UserRepository.GetUser(req)
	if err != nil {
		return nil, err
	}
	// Token生成
	token, err := auth.GenerateJWT(user.ID)
	if err != nil {
		return nil, err
	}

	// Token登録
	newUserAuthToken := model.UserAuthToken{
		UserID: user.ID,
		Token:  token,
	}
	if err := s.UserRepository.CreateUserToken(&newUserAuthToken); err != nil {
		return nil, err
	}
	return &model.UserResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Token: newUserAuthToken.Token,
	}, nil
}

func (s *UserService) AuthUser(header *model.Header) error {
	// ユーザーIDに紐付くトークンを取得し、リクエストのトークンと比較する
	userAuthToken, err := s.UserRepository.GetUserAuthTokenByUserId(header.UserID)
	if err != nil || userAuthToken.Token != header.Token {
		return err
	}
	return nil
}

func (s *UserService) LogoutUser(header *model.Header) error {
	if err := s.AuthUser(header); err != nil {
		return err
	}
	if err := s.UserRepository.DeleteToken(&model.UserAuthToken{UserID: header.UserID, Token: header.Token}); err != nil {
		return err
	}
	return nil
}
func (s *UserService) UpdateUser(header *model.Header, newUser model.User) (*model.UserResponse, error) {
	// 認証チェック
	if err := s.AuthUser(header); err != nil {
		return nil, err
	}

	// 現状のユーザー情報を取得
	user, err := s.UserRepository.GetUserById(header.UserID)
	if err != nil {
		return nil, err
	}

	// 新しいユーザー情報に置き換える
	user.Name = newUser.Name
	user.Email = newUser.Email
	user.Password = newUser.Password

	// データベースに保存
	if err := s.UserRepository.UpdateUser(user); err != nil {
		return nil, err
	}
	return &model.UserResponse{
		ID:    user.ID,
		Name:  user.Email,
		Email: user.Email,
		Token: header.Token,
	}, nil
}

func (s *UserService) DeleteUser(header *model.Header) error {
	if err := s.AuthUser(header); err != nil {
		return err
	}
	if err := s.UserRepository.DeleteUser(header.UserID); err != nil {
		return err
	}
	return nil
}
