package service

import (
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

type UserDomainService struct {
	UserRepository *repository.UserRepository
}

func NewUserDomainService() *UserDomainService {
	return &UserDomainService{
		UserRepository: &repository.UserRepository{},
	}
}

func (s *UserDomainService) UserExist(user *model.User) bool {
	return s.UserRepository.FindNameExist(user.Name) || s.UserRepository.FindEmailExist(user.Email)
}
