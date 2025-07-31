package controllers

import (
    "ecommerce-shopping-cart/database"
    "ecommerce-shopping-cart/models"
    "net/http"

    "github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
    userID := c.GetUint("user_id")

    // Find user's cart
    var cart models.Cart
    if err := database.DB.Preload("CartItems.Item").Where("user_id = ?", userID).First(&cart).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
        return
    }

    if len(cart.CartItems) == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
        return
    }

    // Calculate total
    var total float64
    for _, cartItem := range cart.CartItems {
        total += cartItem.Item.Price
    }

    // Create order
    order := models.Order{
        UserID: userID,
        CartID: cart.ID,
        Total:  total,
    }

    if err := database.DB.Create(&order).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
        return
    }

    // Clear cart items
    database.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{})

    c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully", "order": order})
}

func GetOrders(c *gin.Context) {
    userID := c.GetUint("user_id")
    
    var orders []models.Order
    database.DB.Where("user_id = ?", userID).Find(&orders)
    
    c.JSON(http.StatusOK, orders)
}