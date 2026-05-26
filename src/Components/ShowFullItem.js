import React, { Component } from 'react'

export class ShowFullItem extends Component {
  render() {
    const getImageUrl = (img) => {
      if (!img) {
        return '/img/placeholder.png'
      }

      if (img.startsWith('http')) {
        return img
      }

      const clean = img.replace(/^undefined/, '')

      // старые товары без uploads/
      if (
        !clean.startsWith('/uploads')
      ) {
        return `https://mz-irbit.onrender.com/uploads/products/${clean}`
      }

      return `https://mz-irbit.onrender.com${clean}`
    }
    return (
      <div className='full-item' 
        onClick={() => this.props.onShowItem(this.props.item)}>
        <div onClick={(e) => e.stopPropagation()}>

          <button
            className="close-modal"
            onClick={() => this.props.onShowItem(this.props.item)}
          >
            ✕
          </button>
          
                <img
                  src={getImageUrl(this.props.item.img)}
                  onClick={() => this.props.onShowItem(this.props.item)}
                  alt=""
                />
                <h2>{this.props.item.title}</h2>
                <p>{this.props.item.description}</p>
                <b>{this.props.item.price}₽</b>
                
                <div className='add-to-cart' onClick={() => this.props.onAdd(this.props.item)}>+</div>
            </div>
      </div>
    )
  }
}

export default ShowFullItem