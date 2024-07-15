package errors

import (
	"fmt"
	"log"
	"net/http"

	"github.com/kkito0726/mea-viewer/enum"
)

type CustomError struct {
	StatusCode int    `json:"status_code"`
	ErrorCode  string `json:"error_code"`
	Message    string `json:"message"`
}

func (c *CustomError) Error() string {
	return c.Message
}

func (c *CustomError) Logging() {
	log.Println("error:", fmt.Sprintf("ErrorCode: %s Message: %s", c.ErrorCode, c.Message))
}

// Status: 403
func ForbiddenError(errorCode enum.ErrorCode) *CustomError {
	return &CustomError{
		StatusCode: http.StatusForbidden,
		ErrorCode:  errorCode.Code(),
		Message:    errorCode.Message(),
	}
}

// Status: 404
func NotFoundError(errorCode enum.ErrorCode) *CustomError {
	return &CustomError{
		StatusCode: http.StatusNotFound,
		ErrorCode:  errorCode.Code(),
		Message:    errorCode.Message(),
	}
}

// Status: 409
func ConflictError(errorCode enum.ErrorCode) *CustomError {
	return &CustomError{
		StatusCode: http.StatusConflict,
		ErrorCode:  errorCode.Code(),
		Message:    errorCode.Message(),
	}
}

// Status: 500
func ServerError(errorCode enum.ErrorCode) *CustomError {
	return &CustomError{
		StatusCode: http.StatusInternalServerError,
		ErrorCode:  errorCode.Code(),
		Message:    errorCode.Message(),
	}
}
