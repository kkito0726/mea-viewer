package repository

import (
	"log"

	"github.com/kkito0726/mea-viewer/db"
	"github.com/kkito0726/mea-viewer/model"
)

type UserRepository struct{}

func (r *UserRepository) FindNameExist(name string) bool {
	var existingUser model.User
	if err := db.DB.Where("name = ?", name).First(&existingUser).Error; err == nil {
		return true
	}
	return false
}

func (r *UserRepository) FindEmailExist(email string) bool {
	var existingUser model.User
	if err := db.DB.Where("email = ?", email).First(&existingUser).Error; err == nil {
		return true
	}
	return false
}

func (r *UserRepository) CreateUser(newUser *model.User) error {
	result := db.DB.Create(newUser)
	return result.Error
}

func (r *UserRepository) CreateUserToken(newUserToken *model.UserAuthToken) error {
	return db.DB.Create(newUserToken).Error
}

func (r *UserRepository) GetUser(req *model.LoginUserRequest) (*model.User, error) {
	var user model.User
	if err := db.DB.Where(&model.User{Email: req.Email, Password: req.Password}).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetUserById(id uint) (*model.User, error) {
	var user model.User
	if err := db.DB.First(&user, id).Error; err != nil {
		log.Fatal(err)
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetUserAuthTokenByUserId(userId uint) (*model.UserAuthToken, error) {
	var userAuthToken model.UserAuthToken
	if err := db.DB.Where(&model.UserAuthToken{UserID: userId}).First(&userAuthToken).Error; err != nil {
		return nil, err
	}
	return &userAuthToken, nil
}

func (r *UserRepository) GetUserAuthToken(token string) (*model.UserAuthToken, error) {
	var userAuthToken model.UserAuthToken
	if err := db.DB.Where(&model.UserAuthToken{Token: token}).First(&userAuthToken).Error; err != nil {
		log.Fatal(err)
		return nil, err
	}
	return &userAuthToken, nil
}

func (r *UserRepository) UpdateUser(newUser *model.User) error {
	return db.DB.Save(newUser).Error
}

func (r *UserRepository) DeleteUser(id uint) error {
	return db.DB.Delete(&model.User{}, id).Error
}

func (r *UserRepository) DeleteToken(token *model.UserAuthToken) error {
	return db.DB.Delete(&model.UserAuthToken{UserID: token.UserID, Token: token.Token}).Error
}
