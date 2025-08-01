package main

import (
    "ecommerce-shopping-cart/controllers"
    "ecommerce-shopping-cart/database"
    "ecommerce-shopping-cart/middleware"
    "ecommerce-shopping-cart/models"
    "log"
    "os"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

func main() {
    database.Connect()
    database.DB.AutoMigrate(&models.User{}, &models.Item{}, &models.Cart{}, &models.Order{}, &models.CartItem{})

    seedItems()

    r := gin.Default()

    config := cors.DefaultConfig()
    config.AllowAllOrigins = true
    config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
    r.Use(cors.New(config))

    r.POST("/users", controllers.CreateUser)
    r.GET("/users", controllers.GetUsers)
    r.POST("/users/login", controllers.LoginUser)
    r.POST("/items", controllers.CreateItem)
    r.GET("/items", controllers.GetItems)

    protected := r.Group("/")
    protected.Use(middleware.AuthRequired())
    {
        protected.POST("/carts", controllers.AddToCart)
        protected.GET("/carts", controllers.GetCarts)
        protected.POST("/orders", controllers.CreateOrder)
        protected.GET("/orders", controllers.GetOrders)
    }

    port := os.Getenv("PORT")
    if port == "" {
        port = "8081"
    }

    log.Println("Server starting on port", port)
    r.Run(":" + port)
}

func seedItems() {
    var count int64
    database.DB.Model(&models.Item{}).Count(&count)
    if count == 0 {
        items := []models.Item{
            {Name: "Laptop", Price: 999.99, Description: "High-performance laptop"},
            {Name: "Mouse", Price: 29.99, Description: "Wireless mouse"},
            {Name: "Keyboard", Price: 79.99, Description: "Mechanical keyboard"},
            {Name: "Monitor", Price: 299.99, Description: "24-inch LED monitor"},
            {Name: "Headphones", Price: 149.99, Description: "Noise-cancelling headphones"},
        }
        for _, item := range items {
            database.DB.Create(&item)
        }
        log.Println("Added sample items")
    }
}