import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './News.css'
import Footer from '../Components/Footer'
import {
  YMaps,
  Map,
  Placemark
} from '@pbe/react-yandex-maps'

import axios from 'axios'

export default function News() {

  const [selectedNews, setSelectedNews] = useState(null)
  const navigate = useNavigate()
  const API_URL = 'https://mz-irbit.onrender.com'
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchNews = async () => {

      try {

        const res = await axios.get(
          `${API_URL}/news`
        )

        setNews(res.data)

      } catch (err) {

        console.log('News error:', err)

      } finally {

        setLoading(false)

      }

    }

    fetchNews()

  }, [])

  if (loading) {
    return <h2>Загрузка...</h2>
  }

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

            <img src={`${API_URL}${item.image}`} alt={item.title}  />

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
              src={`${API_URL}${selectedNews.image}`}
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