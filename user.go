package main

type User struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserResponse struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Exists   bool   `json:"exists"`
}
