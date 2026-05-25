import React, { Component } from 'react'

export class Item extends Component {

  render() {

    const item = this.props.item

    // Проверяем есть ли товар в корзине
    const orderItem = this.props.orders.find(
      el => el.id === item.id
    )

    return (
      <div className='item'>

        <div className='item-image'>
          <img
            src={
              item.img
                ? item.img.startsWith('http')
                  ? item.img
                  : `https://mz-irbit.onrender.com${item.img.startsWith('/') ? '' : '/'}${item.img}`
                : '/img/placeholder.png'
            }
            alt=""
          />
        </div>

        <div className='item-info'>
          <h2>{item.title}</h2>

          <b>{item.price}₽</b>
        </div>

        {/* ЕСЛИ товара ещё нет */}
        {!orderItem ? (

          <div
            className='add-to-cart'
            onClick={() => this.props.onAdd(item)}
          >
            +
          </div>

        ) : (

          /* ЕСЛИ товар уже добавлен */
          <div className='card-quantity-controls'>

            <button
              className='card-quantity-btn'
              onClick={() =>
                this.props.decreaseQuantity(item.id)
              }
            >
              -
            </button>

            <span className='card-quantity-value'>
              {orderItem.quantity}
            </span>

            <button
              className='card-quantity-btn'
              onClick={() =>
                this.props.increaseQuantity(item.id)
              }
            >
              +
            </button>

          </div>

        )}

      </div>
    )
  }
}

export default Item