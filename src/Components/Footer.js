import React from 'react'

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaVk,
  FaOdnoklassniki
} from "react-icons/fa"

import {
  YMaps,
  Map,
  Placemark
} from '@pbe/react-yandex-maps'

export default function Footer() {

  return (
    <footer id="footer">

      <div className='footer-content'>

        <div className='footer-left' id="contacts">

          <p>
            <FaMapMarkerAlt className='footer-icon' />
            г. Ирбит, улица Елизарьевых, 3
          </p>

          <p>
            <FaPhoneAlt className='footer-icon' />
            +7 (343) 227-08-02
          </p>

          <p>
            <FaEnvelope className='footer-icon' />
            info@irbit-mz.ru
          </p>

          <div className='socials'>

            <a href="https://vk.com/irbitmz">
              <FaVk />
            </a>

            <a href="https://ok.ru/irbitmz">
              <FaOdnoklassniki />
            </a>

          </div>

        </div>

        <div className='footer-center'>

          <YMaps>

            <Map
              defaultState={{
                center: [57.678233, 63.071533],
                zoom: 16
              }}

              modules={[
                'geoObject.addon.balloon',
                'geoObject.addon.hint'
              ]}

              width="100%"
              height="100%"

              options={{
                suppressMapOpenBlock: true
              }}
            >

              <Placemark
                geometry={[57.678233, 63.071533]}

                properties={{
                  hintContent: 'Ирбитский молочный завод',
                  balloonContent:
                    'г. Ирбит, улица Елизарьевых, 3'
                }}

                options={{
                  preset: 'islands#blueDotIcon'
                }}
              />

            </Map>

          </YMaps>

        </div>

        <div className='footer-right'>

          <p>
            <a href="https://vk.com/club182865555">
              Профком АО “Ирбитский молочный завод”
            </a>
          </p>

          <p>
            <a href="https://irbit-mz.ru/pages/policy">
              Политика конфиденциальности
            </a>
          </p>

        </div>

      </div>

    </footer>
  )
}