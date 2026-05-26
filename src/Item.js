return (
  <div className='item'>

    <div className='item-image'>
      <img
        src={getImageUrl(item.img)}
        alt=""
      />
    </div>

    <div className='item-info'>

      <h2>{item.title}</h2>

      <b>{item.price}₽</b>

      {item.stock <= 0 ? (

        <div className="out-of-stock">
          Нет в наличии
        </div>

      ) : !orderItem ? (

        <div
          className='add-to-cart'
          onClick={() => this.props.onAdd(item)}
        >
          +
        </div>

      ) : (

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

  </div>
)