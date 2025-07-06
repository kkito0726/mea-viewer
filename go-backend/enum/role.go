package enum

type Role string

const (
	SystemAdmin Role = "system_admin"
	Admin       Role = "admin"
	AppUser     Role = "app_user"
)
