package middleware

import (
    "ecommerce-shopping-cart/utils"
    // "ecommerce-shopping-cart/database"
    // "ecommerce-shopping-cart/models"
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        claims, err := utils.ValidateToken(tokenString)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // Optional: Verify token matches the one stored in database for enhanced single-device login
        // This ensures that if a user logs in from another device, previous tokens become invalid
        // Uncomment the lines below if you want this enhanced security:
        
        // var user models.User
        // if err := database.DB.Where("id = ? AND token = ?", claims.UserID, tokenString).First(&user).Error; err != nil {
        //     c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has been invalidated"})
        //     c.Abort()
        //     return
        // }

        c.Set("user_id", claims.UserID)
        c.Next()
    }
}