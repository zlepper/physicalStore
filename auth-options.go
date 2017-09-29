package main

import (
	"time"
	"strings"
	"errors"
	"crypto/rand"
	"os"
	"fmt"
)

const resetMailDirectory = "reset-mails"

type SubjectData struct {
	Username string `json:"username"`
}

// Gets a new instance of the auth handler
func NewAuthHandler(dataStore *DataStore) *AuthHandler {
	return &AuthHandler{
		dataStore:dataStore,
	}
}

type AuthHandler struct {
	dataStore *DataStore
}

func (*AuthHandler) ValidateUser(username, password string, data map[string]interface{}) error {
	if !strings.Contains(username, "@") {
		return errors.New("username is not an email")
	}

	return nil
}

func (a *AuthHandler) CreateUser(username, password string, data map[string]interface{}) error {
	user := User{
		Username:username,
		Password:password,
	}

	return a.dataStore.AddUser(user)
}

func (a *AuthHandler) GetPassword(username string) (password string, err error) {

	user, err := a.dataStore.GetUser(username)
	if err != nil {
		return "", err
	}

	return user.Password, nil
}

func (*AuthHandler) GetSubjectData(username string) (data interface{}, err error) {
	return SubjectData{
		Username:username,
	}, nil
}

func (a *AuthHandler) GetSigningSecret() (signingKey []byte, err error) {
	signingKey = a.dataStore.GetSigningSecret()

	if len(signingKey) == 0 {
		signingKey = make([]byte, 2<<11)
		_, err = rand.Read(signingKey)
		if err != nil {
			return signingKey, err
		}
	}

	return signingKey, nil
}

func (*AuthHandler) GetLoginDuration(rememberMe bool) (duration time.Duration, err error) {
	if rememberMe {
		return time.Hour * 24 * 365, nil
	} else {
		return time.Hour * 24, nil
	}
}

func (*AuthHandler) GetIssuer() (issuer string, err error) {
	return "Physical store", nil
}

func (a *AuthHandler) DoesUserExist(username string) (exists bool, err error) {
	_, err = a.dataStore.GetUser(username)

	if err == nil {
		return true, nil
	}

	if err == ErrNotFound {
		return false, nil
	}

	return false, err
}

func (*AuthHandler) GetResetTokenDuration() (duration time.Duration, err error) {
	return time.Hour * 24 * 365, nil
}

func (a *AuthHandler) SaveToken(token string, expiration time.Time, username string) (err error) {
	a.dataStore.AddToken(token, expiration, username)
	return nil
}

// Doesn't actually send a mail, but just writes the token to a file on the system
func (*AuthHandler) SendResetToken(token, username string) (err error) {
	username = strings.Replace(username, "@", "", -1)
	os.Mkdir(resetMailDirectory, os.ModePerm)
	file, err := os.OpenFile(fmt.Sprintf("%s/%s-reset-token", resetMailDirectory, username), os.O_WRONLY, os.ModePerm)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write([]byte(token))
	return err
}

func (a *AuthHandler) GetTokenExpiration(token string) (expiration time.Time, err error) {
	resetToken, err := a.dataStore.GetResetToken(token)
	if err != nil {
		return time.Unix(0, 0), nil
	}
	return resetToken.Expiration, nil
}

func (*AuthHandler) ValidatePassword(password string) (err error) {
	if len(password) > 0 {
		return nil
	}
	return errors.New("password is empty")
}

func (a *AuthHandler) SetUserPassword(username, password string) (err error) {
	user, err := a.dataStore.GetUser(username)
	if err != nil {
		return err
	}

	user.Password = password
	return a.dataStore.UpdateUser(user)
}

func (a *AuthHandler) DeleteToken(token string) (err error) {
	return a.dataStore.RemoveToken(token)
}

func (a *AuthHandler) GetUsername(token string) (username string, err error) {
	resetToken, err := a.dataStore.GetResetToken(token)
	if err != nil {
		return "", err
	}

	return resetToken.Username, nil
}

func (*AuthHandler) GetNewDataCarrier() (template interface{}, err error) {
	return &SubjectData{}, nil
}


