import React, { Component } from 'react'

export class Categories extends Component {

  render() {

    return (

      <div className='categories'>

        {this.props.categories.map(el => (

          <div
            key={el.id}

            onClick={() =>
              this.props.chooseCategory(el.name)
            }
          >
            {el.name}
          </div>

        ))}

      </div>
    )
  }
}

export default Categories