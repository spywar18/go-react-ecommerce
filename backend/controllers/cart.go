package controllers

import (
    "ecommerce-shopping-cart/database"
    "ecommerce-shopping-cart/models"
    "net/http"

    "github.com/gin-gonic/gin"
)

func AddToCart(c *gin.Context) {
    userID := c.GetUint("user_id")
    
    var requestData struct {
        ItemID uint `json:"item_id" binding:"required"`
    }

    if err := c.ShouldBindJSON(&requestData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Find or create cart for user
    var cart models.Cart
    if err := database.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
        // Create new cart
        cart = models.Cart{UserID: userID}
        if err := database.DB.Create(&cart).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
            return
        }
    }

    // Add item to cart
    cartItem := models.CartItem{
        CartID: cart.ID,
        ItemID: requestData.ItemID,
    }

    if err := database.DB.Create(&cartItem).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Item added to cart", "cart_item": cartItem})
}

func GetCarts(c *gin.Context) {
    userID := c.GetUint("user_id")
    
    var cart models.Cart
    if err := database.DB.Preload("CartItems.Item").Where("user_id = ?", userID).First(&cart).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
        return
    }

    c.JSON(http.StatusOK, cart)
}