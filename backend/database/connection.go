package database

import (
    "database/sql"
    "log"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    _ "modernc.org/sqlite" // Pure Go SQLite driver
)

var DB *gorm.DB

func Connect() {
    var err error
    
    // First open with the pure Go driver directly
    sqlDB, err := sql.Open("sqlite", "shopping_cart.db?_pragma=foreign_keys(1)")
    if err != nil {
        log.Fatal("Failed to open database:", err)
    }
    
    // Then use GORM with the existing connection
    DB, err = gorm.Open(sqlite.Dialector{Conn: sqlDB}, &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    log.Println("Database connected successfully")
}