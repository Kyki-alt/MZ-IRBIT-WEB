import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API_URL from '../../config'

export default function NewsManager() {

  const [news, setNews] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    const res = await axios.get(`${API_URL}/news`)
    setNews(res.data)
  }

  const uploadImage = async (file) => {
    setUploading(true)

    const formData = new FormData()
    formData.append('image', file)

    const res = await axios.post(
      `${API_URL}/news/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    setImage(res.data.imageUrl)
    setUploading(false)
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = { title, description, image }

    if (editingId) {
      await axios.put(`${API_URL}/news/${editingId}`, payload)
    } else {
      await axios.post(`${API_URL}/news`, payload)
    }

    setTitle('')
    setDescription('')
    setImage('')
    setEditingId(null)

    fetchNews()
    setLoading(false)
  }

  const edit = (item) => {
    setTitle(item.title)
    setDescription(item.description)
    setImage(item.image)
    setEditingId(item.id)
  }

  const remove = async (id) => {
    await axios.delete(`${API_URL}/news/${id}`)
    fetchNews()
  }

  return (
    <div className="news-admin">

      <h2>📰 Управление новостями</h2>

      {/* FORM */}
      <form onSubmit={submit} className="news-form">

        <input
          placeholder="Заголовок"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Описание"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="file"
          onChange={e => uploadImage(e.target.files[0])}
        />

        {uploading && <p>Загрузка изображения...</p>}

        {image && (
          <img
            src={`${API_URL}${image}`}
            style={{ width: 200, marginTop: 10 }}
          />
        )}

        <button disabled={loading}>
          {editingId ? 'Обновить' : 'Создать'}
        </button>

      </form>

      {/* LIST */}
      <div className="news-grid">

        {news.map(item => (
          <div key={item.id} className="news-card-admin">

            <img src={`${API_URL}${item.image}`} />

            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <button onClick={() => edit(item)}>
              Редактировать
            </button>

            <button onClick={() => remove(item.id)}>
              Удалить
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}