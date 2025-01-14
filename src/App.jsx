import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Guitar } from './components/Guitar'
import { db } from './data/db'

export const MAX_ITEMS = 5
export const MIN_ITEMS = 1

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [ data ] = useState(db)
  const [ cart, setCart ] = useState(initialCart)

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

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>
    </>
  )
}

export default App
