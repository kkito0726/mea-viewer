package service

import (
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

type UserDomainService struct {
	UserRepository *repository.UserRepository
}

func NewUserDomainService(repo *repository.UserRepository) *UserDomainService {
	return &UserDomainService{
		UserRepository: repo,
	}
}

func (s *UserDomainService) CheckUserConflict(user *model.User) *errors.CustomError {
	// ユーザーネームの重複確認
	if s.UserRepository.FindNameExist(user.Name) {
		return errors.ConflictError(enum.C001)
	}

	// emailの重複確認
	if s.UserRepository.FindEmailExist(user.Email) {
		return errors.ConflictError(enum.C002)
	}

	return nil
}
