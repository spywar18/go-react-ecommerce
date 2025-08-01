package database

import (
    "database/sql"
    "log"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    _ "modernc.org/sqlite"
)

var DB *gorm.DB

func Connect() {
    var err error
    
    sqlDB, err := sql.Open("sqlite", "shopping_cart.db?_pragma=foreign_keys(1)")
    if err != nil {
        log.Fatal("Failed to open database:", err)
    }
    
    DB, err = gorm.Open(sqlite.Dialector{Conn: sqlDB}, &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    log.Println("Database connected successfully")
}