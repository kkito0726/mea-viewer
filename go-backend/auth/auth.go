package auth

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

const EXPIRATION_YEAR = 4

var jwtKey = []byte("my_secret_key")

type Claims struct {
	UserID uint `json:"user_id"`
	jwt.StandardClaims
}

func GenerateJWT(userID uint) (string, error) {
	expirationTime := time.Now().Add(EXPIRATION_YEAR * 365 * 24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func ValidateJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return nil, err
		}
		return nil, err
	}

	if !token.Valid {
		return nil, err
	}

	return claims, nil
}
