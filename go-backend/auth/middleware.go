package auth

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			err := errors.UnauthorizedError(enum.C007)
			c.AbortWithStatusJSON(err.StatusCode, gin.H{"error": err})
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
			err := errors.UnauthorizedError(enum.C007)
			c.AbortWithStatusJSON(err.StatusCode, gin.H{"error": err})
			return
		}

		claims, err := ValidateJWT(bearerToken[1])
		if err != nil {
			customErr := errors.UnauthorizedError(enum.C007)
			c.AbortWithStatusJSON(customErr.StatusCode, gin.H{"error": customErr})
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("token", bearerToken[1])
		c.Next()
	}
}
