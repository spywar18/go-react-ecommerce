package models

import (
    "time"
    "gorm.io/gorm"
)

type User struct {
    ID        uint           `json:"id" gorm:"primaryKey"`
    Username  string         `json:"username" gorm:"unique;not null"`
    Email     string         `json:"email"`
    Password  string         `json:"password,omitempty" gorm:"not null"`
    Token     string         `json:"token"`
    CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
    DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
    
    Carts  []Cart  `json:"carts,omitempty"`
    Orders []Order `json:"orders,omitempty"`
}