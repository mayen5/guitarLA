import { useEffect, useState, useMemo } from 'react'
import { db } from '../data/db'

export const useCart = () => {
      const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
    
      const [ data ] = useState(db)
      const [ cart, setCart ] = useState(initialCart)

      const MAX_ITEMS = 5
      const MIN_ITEMS = 1
    
      useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
      }, [ cart ])
    
      const addToCart = (item) => {
        const itemExists = cart.findIndex((cartItem) => cartItem.id === item.id)
        if (itemExists >= 0) {
          if (cart[ itemExists ].quantity >= MAX_ITEMS) {
            return
          }
          const updatedCart = [ ...cart ]
          updatedCart[ itemExists ].quantity++
          setCart(updatedCart)
        } else {
          item.quantity = 1
          setCart([ ...cart, item ])
        }
      }
    
      const removeFromCart = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id)
        setCart(updatedCart)
      }
    
      const increaseQuantity = (id) => {
        const updatedCart = cart.map((item) => {
          if (item.id === id && item.quantity <= MAX_ITEMS) {
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      const decreaseQuantity = (id) => {
        const updatedCart = cart.map((item) => {
          if (item.id === id && item.quantity > MIN_ITEMS) {
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      const clearCart = () => {
        setCart([])
      }

      const isEmptyCart = useMemo(() => cart.length === 0, [ cart ])

      const totalCart = useMemo(() => {
        return cart.reduce((acc, item) => (acc += item?.price * item?.quantity), 0)
      }, [ cart ])

      return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        MAX_ITEMS,
        MIN_ITEMS,
        isEmptyCart,
        totalCart,
      }
}
