import React, { Component } from 'react'

export class Categories extends Component {

  render() {

    return (

      <div className='categories'>

        {this.props.categories.map(el => (

          <div
            key={el.key_name}

            onClick={() =>
              this.props.chooseCategory(
                el.key_name
              )
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