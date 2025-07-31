package controllers

import (
    "ecommerce-shopping-cart/database"
    "ecommerce-shopping-cart/models"
    "ecommerce-shopping-cart/utils"
    "log"
    "net/http"

    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
)

func CreateUser(c *gin.Context) {
    var user models.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    log.Printf("Creating user: %s with password: %s", user.Username, user.Password)

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }
    user.Password = string(hashedPassword)

    log.Printf("Hashed password for user %s: %s", user.Username, user.Password)

    // Create user
    if err := database.DB.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    // Generate token for immediate login
    token, err := utils.GenerateToken(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    // Update user with token
    user.Token = token
    database.DB.Save(&user)

    // Clear password before returning response
    user.Password = ""

    log.Printf("User created successfully: %s", user.Username)
    c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "token": token, "user": user})
}

func GetUsers(c *gin.Context) {
    var users []models.User
    database.DB.Find(&users)
    c.JSON(http.StatusOK, users)
}

func LoginUser(c *gin.Context) {
    var loginData struct {
        Username string `json:"username" binding:"required"`
        Password string `json:"password" binding:"required"`
    }

    if err := c.ShouldBindJSON(&loginData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    log.Printf("Login attempt for username: %s with password: %s", loginData.Username, loginData.Password)

    var user models.User
    if err := database.DB.Where("username = ?", loginData.Username).First(&user).Error; err != nil {
        log.Printf("User not found: %s", loginData.Username)
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/password"})
        return
    }

    log.Printf("Found user: %s, stored password hash: %s", user.Username, user.Password)
    log.Printf("Comparing with input password: %s", loginData.Password)
    
    // Check password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password)); err != nil {
        log.Printf("Password mismatch for user: %s, bcrypt error: %v", user.Username, err)
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/password"})
        return
    }

    // Generate token
    token, err := utils.GenerateToken(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    // Update user token (single device login)
    user.Token = token
    database.DB.Save(&user)

    // Clear password before returning response
    user.Password = ""

    log.Printf("Login successful for user: %s", user.Username)
    c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}