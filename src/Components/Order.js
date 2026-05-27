import React, { Component } from 'react'
import { FaTrash } from 'react-icons/fa'

export class Order extends Component {
  render() {

    const item = this.props.item

    const getImageUrl = (img) => {
      if (!img) {
        return '/img/placeholder.png'
      }

      if (img.startsWith('http')) {
        return img
      }

      const clean = img.replace(/^undefined/, '')

      // старые товары без uploads/
      if (!clean.startsWith('/uploads')) {
        return `https://mz-irbit.onrender.com/uploads/products/${clean}`
      }

      return `https://mz-irbit.onrender.com${clean}`
    }

    return (
      <div className='cart-item'>

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
                this.props.increaseQuantity(item.id)
              }
            >
              +
            </button>

          </div>
        </div>

        <div className='cart-item-right'>
          <FaTrash
            className='delete-icon'
            onClick={() =>
              this.props.onDelete(item.id)
            }
          />
        </div>

      </div>
    )
  }
}

export default Order