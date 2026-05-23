import React, { Component } from 'react'
import Item from './Item'

export class items extends Component {
  render() {
    return (
      <main>
        {this.props.items.map(el => (
            <Item onShowItem={this.props.onShowItem} key={el.id} item={el} onAdd={this.props.onAdd}
             orders={this.props.orders}

            increaseQuantity={this.props.increaseQuantity}
            decreaseQuantity={this.props.decreaseQuantity} />
        ))}
      </main>
    )
  }
}

export default items