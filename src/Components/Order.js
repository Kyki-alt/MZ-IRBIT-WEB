import React, { Component } from 'react'
import { FaTrash } from 'react-icons/fa'

export class Order extends Component {
  render() {

    const item = this.props.item

    return (
      <div className='item'>

        <img
              src={getImageUrl(item.img)}
              alt=""
        />
        <div className='cart-item-info'>
          <h2>{item.title}</h2>

          <p>{item.price}₽ × {item.quantity}</p>

          <div className='quantity-controls'>

            <button
              className='quantity-btn'
              onClick={() =>
                this.props.decreaseQuantity(item.id)
              }
            >
              −
            </button>

            <span className='quantity-value'>
              {item.quantity}
            </span>

            <button
              className='quantity-btn'
              onClick={() =>
                this.props.increaseQuantity(this.props.item.id)
              }
            >
              +
            </button>

          </div>
        </div>

        <FaTrash
          className='delete-icon'
          onClick={() =>
            this.props.onDelete(item.id)
          }
        />

      </div>
    )
  }
}

export default Order