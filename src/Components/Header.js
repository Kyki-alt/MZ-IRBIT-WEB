import React, { useState } from 'react'
import { FaShoppingCart } from "react-icons/fa"
import Order from './Order'
import { useNavigate, Link } from 'react-router-dom'

const showNothing = () => {
  return (
    <div className='empty'>
      <h2>Товары не выбраны</h2>
    </div>
  )
}

export default function Header(props) {

  const [cartOpen, setCartOpen] = useState(false)

  const navigate = useNavigate()

  const totalCount = props.orders.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const totalPrice = props.orders.reduce(
    (sum, item) =>
      sum + parseFloat(item.price) * item.quantity,
    0
  )

  const hasValidItems = props.orders.some(
    item => !item.disabled && item.quantity > 0
  )

  return (
  <header>

    {/* ЛОГО */}
    <div className='brand'>

      <img
        className='logo'
        src="./img/logo.jpg"
        alt="Логотип"
      />

      <div className='brand-text'>
        <h1>Ирбитский молочный завод</h1>
        <p>Натуральная молочная продукция</p>
      </div>

    </div>

    {/* ПРАВАЯ ЧАСТЬ */}
    <div className="header-right">

      {/* НАВИГАЦИЯ */}

      <Link to="/news" className="nav-link">
        Новости
      </Link>

      <button
        className="nav-link"
        onClick={() => {
          document.getElementById('footer')?.scrollIntoView({
            behavior: 'smooth'
          })
        }}
        >
        Контакты
      </button>

      <div className="cart-wrapper">

      <FaShoppingCart
        onClick={() => setCartOpen(!cartOpen)}
        className={`shop-cart-button ${cartOpen ? 'active' : ''}`}
      />

      {totalCount > 0 && (
        <span className="cart-count">
          {totalCount}
        </span>
      )}

      {cartOpen && (
        <div className='shop-cart'>

          {props.orders.length > 0 ? (
            <div>

              {props.orders.map(el => (
                <Order
                  key={el.id}
                  item={el}
                  onDelete={props.onDelete}
                  increaseQuantity={props.increaseQuantity}
                  decreaseQuantity={props.decreaseQuantity}
                />
              ))}

              <p className='summa'>
                Итоговая сумма:
                {' '}
                {new Intl.NumberFormat().format(totalPrice)}₽
              </p>

              <div className="total-amount__buttons-section"><div className="">
      <div className="buy-button-wrapper" id="buy-btn-main">
        <div className="">
            <div>
                <button
                  className="base-ui-button_JKH base-ui-button_big_rMI base-ui-button_brand_avQ base-ui-button_ico-none_M-8 buy-button"
                  onClick={() => {
                    if (!hasValidItems) return

                    localStorage.setItem(
                      'cart',
                      JSON.stringify(props.orders)
                    )

                    navigate('/checkout')
                  }}
                  disabled={!hasValidItems}
                  >
                  <div className="base-ui-button__ico_1Mx">
                    <div className="buy-button__icon"></div>
                  </div>

                  <span className="base-ui-button__text_6Sd">
                    Перейти к оформлению
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>

            </div>
          ) : (
            showNothing()
          )}

        </div>
      )}

    </div>

  </div>

</header>
  )
}