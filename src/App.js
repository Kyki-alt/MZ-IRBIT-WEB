import React from "react";
import axios from "axios";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Items from "./Items";
import Categories from "./Components/Categories";
import ShowFullItem from "./Components/ShowFullItem";

class App extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      orders: [],
      items: [],
      currentItems: [],
      categories: [],
      showFullItem: false,
      fullItem: {}
    }

    this.addToOrder =
      this.addToOrder.bind(this)

    this.deleteOrder =
      this.deleteOrder.bind(this)

    this.chooseCategory =
      this.chooseCategory.bind(this)

    this.onShowItem =
      this.onShowItem.bind(this)

    this.increaseQuantity =
      this.increaseQuantity.bind(this)

    this.decreaseQuantity =
      this.decreaseQuantity.bind(this)
  }

  // Загрузка данных с backend
  async componentDidMount() {

    // загружаем корзину
      const savedOrders =
          JSON.parse(
            localStorage.getItem('cart')
          ) || []

    try {

      // товары
      const productsResponse =
        await axios.get(
          'https://mz-irbit.onrender.com/api/products'
        )

      // категории
      const categoriesResponse =
        await axios.get(
          'https://mz-irbit.onrender.com/categories'
        )

      this.setState({

        orders: savedOrders,

        items:
          productsResponse.data,

        currentItems:
          productsResponse.data,

        categories:
          categoriesResponse.data
      })

    } catch (error) {

      console.log(
        'Ошибка загрузки данных:',
        error
      )
    }
  }

  render() {

    return (

      <div>

        <Header
          orders={this.state.orders}
          onDelete={this.deleteOrder}
          increaseQuantity={this.increaseQuantity}
          decreaseQuantity={this.decreaseQuantity}
        />

        <div className="wrapper">

          <Categories
            categories={this.state.categories}
            chooseCategory={this.chooseCategory}
          />

          <Items
            onShowItem={this.onShowItem}

            items={this.state.currentItems}

            onAdd={this.addToOrder}

            orders={this.state.orders}

            increaseQuantity={this.increaseQuantity}

            decreaseQuantity={this.decreaseQuantity}
          />

          {this.state.showFullItem && (

            <ShowFullItem
              onAdd={this.addToOrder}

              onShowItem={this.onShowItem}

              item={this.state.fullItem}
            />

          )}

        </div>

        <Footer />

      </div>
    )
  }

  onShowItem(item) {

    this.setState({

      fullItem: item,

      showFullItem:
        !this.state.showFullItem
    })
  }

  chooseCategory(category) {

    if (category === 'all') {

      this.setState({

        currentItems:
          this.state.items
      })

      return
    }

    this.setState({

      currentItems:
        this.state.items.filter(
          el => el.category === category
        )
    })
  }

  deleteOrder(id) {

    this.setState({

      orders:
        this.state.orders.filter(
          el => el.id !== id
        )
      }, () => {

        localStorage.setItem(

          'cart',

          JSON.stringify(
            this.state.orders
          )
        )

    })
  }

  increaseQuantity(id) {

    const currentItem =
      this.state.orders.find(
        item => item.id === id
      )

    if (!currentItem) return

    // 🚫 лимит склада
    if (currentItem.quantity >= currentItem.stock) {
      alert('Больше товара нет в наличии')
      return
    }

    this.setState({

      orders:
        this.state.orders.map(item =>

          item.id === id

            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }

            : item
        )

    }, () => {

      localStorage.setItem(

        'cart',

        JSON.stringify(
          this.state.orders
        )
      )

    })
  }

  decreaseQuantity(id) {

     this.setState({

    orders:
      this.state.orders

        .map(item =>

          item.id === id

            ? {
                ...item,
                quantity:
                  item.quantity - 1
              }

            : item
        )

        // удаляем если 0
        .filter(
          item => item.quantity > 0
        )

    }, () => {

      localStorage.setItem(

        'cart',

        JSON.stringify(
          this.state.orders
        )
      )

    })
  }

  addToOrder(item) {

    const exists =
      this.state.orders.find(
        el => el.id === item.id
      )

    // если товар уже есть
    if (exists) {

      // 🚫 нельзя больше остатка
      if (exists.quantity >= item.stock) {
        alert('Недостаточно товара на складе')
        return
      }

      this.setState({

        orders:
          this.state.orders.map(el =>

            el.id === item.id

              ? {
                  ...el,
                  quantity:
                    el.quantity + 1
                }

              : el
          )

      }, () => {

        localStorage.setItem(
          'cart',
          JSON.stringify(this.state.orders)
        )

      })

    } else {

      // 🚫 если товара нет в наличии
      if (item.stock <= 0) {
        alert('Товар закончился')
        return
      }

      this.setState({

        orders: [

          ...this.state.orders,

          {
            ...item,
            quantity: 1
          }
        ]

      }, () => {

        localStorage.setItem(
          'cart',
          JSON.stringify(this.state.orders)
        )

      })
    }
  }
}

export default App