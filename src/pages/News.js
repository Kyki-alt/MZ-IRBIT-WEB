import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './News.css'
import Footer from '../Components/Footer'
import {
  YMaps,
  Map,
  Placemark
} from '@pbe/react-yandex-maps'

export default function News() {

  const [selectedNews, setSelectedNews] = useState(null)

  const navigate = useNavigate()

  const news = [

    {
      id: 1,
      image: '/news/2-х слойные.webp',
      title: 'Новые двухслойные йогурты',
      description: `
Вы, правда, думали, что Новый год пройдет без подарков от Ирбитского молочного завода? Конечно, нет!!!

Сразу пять новых вкусов двухслойного йогурта, уверены, сделают каждое ваше утро добрым и радостным!

Наполняйтесь хорошим настроением с полезными новинками от Ирбитского молочного завода!

Здоровья, удачи и новых открытий!!!🥰
      `
    },

    {
      id: 2,
      image: '/news/new kefir.webp',
      title: 'Новый дизайн кефира',
      description: `
Новый вид любимого кефира от Ирбитского молочного завода!
Мы обновили только дизайн упаковки, оставив прежними технологию производства, натуральный состав и вкус продукта.
      `
    },

    {
      id: 3,
      image: '/news/new moloko.webp',
      title: 'Молока 3,2% - новая упаковка!',
      description: `
Ирбитское пастеризованное молоко 3,2% теперь в новой упаковке!
Мы обновили дизайн, но сохранили главное:
вкус, натуральный состав и высокое качество.

С заботой о свежести, с заботой о вас!
      `
    },

    {
      id: 4,
      image: '/news/new tvorog.jpg',
      title: 'Творожные сырки в новом дизайне',
      description: `
Долгожданные новости!
Творожные сырки от Ирбитского молочного завода теперь в новом дизайне и с улучшенной рецептурой.

Мы учли пожелания наших потребителей, чтобы создать 5 вкусов нежных и воздушных творожных сырков:
• С сахаром и ванилином
• Печеная груша
• Чернослив-курага
• «Картошка»
• Сладкий с изюмом
      `
    },

    {
      id: 5,
      image: '/news/new iogurt.jpg',
      title: 'Мы обновили дизайн упаковки питьевых йогуртов мини-формата!',
      description: `
Объём, состав и другие характеристики напитков остались прежними.

Изменилось только оформление, чтобы было ещё проще и удобнее разглядеть всю самую важную информацию на лицевой стороне бутылочек.

Также в линейку питьевых йогуртов удобного мини-формата добавлен новый вкус — «Клубника».
      `
    },

    {
      id: 6,
      image: '/news/new plastik moloko.jpg',
      title: 'Возвращение легенды!',
      description: `
Теперь ещё удобнее:
встречайте любимое топленое молоко от Ирбитского молочного завода в новой упаковке — ПЭТ-бутылочке и в объёме 400 мл.

Такой формат легко взять с собой на работу или в поездку.
С заботой о вас!
      `
    }

  ]

  return (
    <div className="news-page">

      <div className="news-header">

        <button
          className="home-btn"
          onClick={() => navigate('/')}
        >
          Главная
        </button>

        <h1 className="news-title">Новости</h1>

      </div>

      <div className="news-list">

        {news.map(item => (

          <div
            key={item.id}
            className="news-card"
            onClick={() => setSelectedNews(item)}
          >

            <img src={item.image} alt={item.title} />

            <div className="news-info">
              <h3>{item.title}</h3>
            </div>

          </div>

        ))}

      </div>

      {selectedNews && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedNews(null)}
        >

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={selectedNews.image}
              alt={selectedNews.title}
            />

            <h2>{selectedNews.title}</h2>

            <p>{selectedNews.description}</p>

            <button
              className="close-btn"
              onClick={() => setSelectedNews(null)}
            >
              Закрыть
            </button>

          </div>

        </div>
      )}
      <Footer />
    </div>
  )
}