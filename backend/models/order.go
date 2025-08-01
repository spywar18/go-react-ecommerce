package models

import (
    "time"
    "gorm.io/gorm"
)

type Order struct {
    ID        uint           `json:"id" gorm:"primaryKey"`
    UserID    uint           `json:"user_id" gorm:"not null"`
    CartID    uint           `json:"cart_id" gorm:"not null"`
    Total     float64        `json:"total"`
    CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
    DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
    
    User User `json:"user,omitempty"`
    Cart Cart `json:"cart,omitempty"`
}