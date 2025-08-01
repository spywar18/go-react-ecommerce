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

    var item models.Item
    if err := database.DB.First(&item, requestData.ItemID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
        return
    }

    var cart models.Cart
    if err := database.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
        cart = models.Cart{UserID: userID}
        if err := database.DB.Create(&cart).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
            return
        }
    }

    var existingCartItem models.CartItem
    if err := database.DB.Where("cart_id = ? AND item_id = ?", cart.ID, requestData.ItemID).First(&existingCartItem).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Item already in cart"})
        return
    }
    cartItem := models.CartItem{
        CartID: cart.ID,
        ItemID: requestData.ItemID,
    }

    if err := database.DB.Create(&cartItem).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Added to cart", "cart_item": cartItem})
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