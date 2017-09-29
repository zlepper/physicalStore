package main

import (
	"encoding/gob"
	"encoding/json"
	"errors"
	"github.com/satori/go.uuid"
	"log"
	"os"
	"strings"
	"sync"
	"time"
)

var (
	ErrNotFound     = errors.New("not found")
	ErrConflict     = errors.New("already exists")
	ErrAlreadyHasId = errors.New("already has id")
)

// Create a new random string for id
func generateId() string {
	id := uuid.NewV4().String()
	return strings.Replace(id, "-", "", -1)
}

type ResetToken struct {
	Username   string
	Token      string
	Expiration time.Time
}

type Attachment struct {
	// The id of the attachment
	Id string `json:"id"`
	// The filename the file was saved as
	Filename string `json:"filename"`
	// Indicates if this file is an image
	IsImage bool `json:"isImage"`
	// The username of the user who uploaded this file
	Uploader string `json:"uploader"`
}

type Post struct {
	// The id of the post
	Id string `json:"id"`
	// The name of the post
	Name string `json:"name"`
	// The path to any attachments
	Attachments []Attachment `json:"attachments"`
	// The username of the user who created this post
	Creator string `json:"creator"`
}

type PostList struct {
	// The id of the list
	Id string `json:"id"`
	// All the posts made on this list
	Posts     []Post `json:"posts"`
	postsLock sync.RWMutex
	// The name of the list
	Name string `json:"name"`
	// The username of the owner of this post
	Owner string `json:"owner"`
}

// Checks if the given user can actually access the list
func (pl PostList) IsAccessor(accessor string) bool {
	if pl.Owner == accessor {
		return true
	}

	return false
}


// Stores the data for the application, as we don't have an actual DB
type DataStore struct {
	Users     []User `json:"users"`
	usersLock sync.RWMutex

	SigningSecret []byte `json:"signing_secret"`

	ResetTokens     []ResetToken `json:"reset_tokens"`
	resetTokensLock sync.RWMutex

	PostLists     []PostList `json:"post_lists"`
	postListsLock sync.RWMutex

	sourceFile        string
	isAutomaticSaving bool
}

func (store *DataStore) AddUser(user User) error {
	store.usersLock.Lock()
	defer store.usersLock.Unlock()

	for _, existingUser := range store.Users {
		if user.Username == existingUser.Username {
			return ErrConflict
		}
	}

	store.Users = append(store.Users, user)
	return nil
}

func (store *DataStore) UpdateUser(user User) error {
	store.usersLock.Lock()
	defer store.usersLock.Unlock()

	for i, existingUser := range store.Users {
		if user.Username == existingUser.Username {
			store.Users[i] = user
			return nil
		}
	}

	return ErrNotFound
}

func (store *DataStore) GetUser(username string) (User, error) {
	store.usersLock.RLock()
	defer store.usersLock.RUnlock()

	for _, user := range store.Users {
		if user.Username == username {
			return user, nil
		}
	}

	return User{}, ErrNotFound
}

func (store *DataStore) GetSigningSecret() []byte {
	return store.SigningSecret
}

func (store *DataStore) SetSigningSecret(secret []byte) {
	store.SigningSecret = secret
}

func (store *DataStore) AddToken(token string, expiration time.Time, username string) {
	store.resetTokensLock.Lock()
	defer store.resetTokensLock.Unlock()

	t := ResetToken{
		Username:   username,
		Token:      token,
		Expiration: expiration,
	}

	store.ResetTokens = append(store.ResetTokens, t)
}

func (store *DataStore) GetResetToken(token string) (ResetToken, error) {
	store.resetTokensLock.RLock()
	defer store.resetTokensLock.RUnlock()

	for _, resetToken := range store.ResetTokens {
		if resetToken.Token == token {
			return resetToken, nil
		}
	}

	return ResetToken{}, ErrNotFound
}

func (store *DataStore) RemoveToken(token string) error {
	store.resetTokensLock.Lock()
	defer store.resetTokensLock.Unlock()

	targetIndex := -1
	for index, resetToken := range store.ResetTokens {
		if resetToken.Token == token {
			targetIndex = index
			break
		}
	}

	store.ResetTokens = append(store.ResetTokens[:targetIndex], store.ResetTokens[targetIndex:]...)

	return nil
}

func (store *DataStore) StartAutomaticSaving() {

	// If the store is already automatically saving, then we can stop caring
	if store.isAutomaticSaving {
		return
	}

	store.isAutomaticSaving = true

	for true {
		select {
		// Or save whenever 10 seconds has passed
		case <-time.After(10 * time.Second):
			store.save()
		}
	}
}

var physicalStoreDebug = os.Getenv("PHYSICAL_STORE_DEBUG")

func (store *DataStore) save() {
	file, err := os.OpenFile(store.sourceFile, os.O_WRONLY, os.ModePerm)
	if err != nil {
		log.Println("ERR when opening file for datastore save: ", err)
		return
	}

	if physicalStoreDebug == "true" {
		err := json.NewEncoder(file).Encode(store)
		if err != nil {
			log.Println("ERR when encoding json to datastore file: ", err)
		}
	} else {
		err := gob.NewEncoder(file).Encode(store)
		if err != nil {
			log.Println("ERR when encoding gob to datastore file: ", err)
		}
	}
}

// Creates a new datastore from the given file
// The file will also be updated as the datastore values changes
func NewDataStore(fromFile string) (*DataStore, error) {
	ds := &DataStore{
		sourceFile: fromFile,
	}

	file, err := os.Open(fromFile)
	if err != nil {
		if !os.IsNotExist(err) {
			return nil, err
		}
		// If we can't find the source file in the first place, then it should be safe to
		// assume that it's the first time we are starting
		return ds, nil
	}
	defer file.Close()

	// In debug mode we user json for data storage, as it can be read in an editor
	if physicalStoreDebug == "true" {
		err = json.NewDecoder(file).Decode(ds)
		if err != nil {
			return nil, err
		}
	} else {
		err = gob.NewDecoder(file).Decode(ds)
		if err != nil {
			return nil, err
		}
	}

	return ds, nil
}

// Gets a post list with the given name, for the given owner
// The name param is the name of the list itself
// The accessor is the person accessing the list, with owner taking priority,
// And anything else being second
func (store *DataStore) GetList(id string) (PostList, error) {
	store.postListsLock.RLock()
	defer store.postListsLock.RUnlock()

	//possibleLists := make([]PostList, 0)
	// Look for a matching list, and return it if the accessor is the owner of the list
	for _, list := range store.PostLists {
		if list.Id == id {
			return list, nil
		}
	}

	return PostList{}, ErrNotFound
}

// Gets all the lists associated with the accessor
func (store *DataStore) GetAllList(accessor string) ([]PostList, error) {
	store.postListsLock.RLock()
	defer store.postListsLock.RUnlock()

	matches := make([]PostList, 0)
	for _, list := range store.PostLists {
		if list.IsAccessor(accessor) {
			matches = append(matches, list)
		}
	}

	return matches, nil
}

// Adds a new list to the DataStore
// It is assumed that checks has been done ahead of time to avoid conflicts
func (store *DataStore) AddList(list PostList) (PostList, error) {
	if list.Id != "" {
		return PostList{}, ErrAlreadyHasId
	}

	// Assign an id to the list
	list.Id = generateId()

	store.postListsLock.Lock()
	defer store.postListsLock.Unlock()

	store.PostLists = append(store.PostLists, list)

	return list, nil
}

// Updates the post list values
// For now only updates the name of the list
func (store *DataStore) UpdateList(list PostList) error {
	if list.Id == "" {
		return errors.New("invalid list | Missing id")
	}

	_, err := store.GetList(list.Id)
	if err == ErrNotFound {
		return errors.New("unable to update non-existing list")
	}

	store.postListsLock.Lock()
	defer store.postListsLock.Unlock()

	for index, existingList := range store.PostLists {
		if existingList.Id == list.Id {
			existingList.Name = list.Name
			store.PostLists[index] = existingList
			return nil
		}
	}

	return nil
}
