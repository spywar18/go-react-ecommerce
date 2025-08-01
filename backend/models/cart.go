package models

import (
    "time"
    "gorm.io/gorm"
)

type Cart struct {
    ID        uint           `json:"id" gorm:"primaryKey"`
    UserID    uint           `json:"user_id" gorm:"not null"`
    CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
    DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
    
    User      User       `json:"user,omitempty"`
    CartItems []CartItem `json:"cart_items,omitempty"`
}

type CartItem struct {
    ID     uint `json:"id" gorm:"primaryKey"`
    CartID uint `json:"cart_id" gorm:"not null"`
    ItemID uint `json:"item_id" gorm:"not null"`
    
    Cart Cart `json:"cart,omitempty"`
    Item Item `json:"item,omitempty"`
}