import React, { Component } from 'react'

export class ShowFullItem extends Component {
  render() {
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
          
                <img src={`https://mz-irbit.onrender.com${this.props.item.img}`} onClick={() => this.props.onShowItem(this.props.item)} />
                
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