import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API_URL from '../../config'
import './NewsManager.css'

export default function NewsManager() {

  const [news, setNews] = useState([])
  const [showForm, setShowForm] = useState(false)

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

  // ================= UPLOAD =================
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

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = { title, description, image }

    if (editingId) {
      await axios.put(`${API_URL}/news/${editingId}`, payload)
    } else {
      await axios.post(`${API_URL}/news`, payload)
    }

    resetForm()
    fetchNews()
    setLoading(false)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setImage('')
    setEditingId(null)
    setShowForm(false)
  }

  // ================= EDIT =================
  const edit = (item) => {
    setTitle(item.title)
    setDescription(item.description)
    setImage(item.image)
    setEditingId(item.id)
    setShowForm(true)
  }

  // ================= DELETE =================
  const remove = async (id) => {
    await axios.delete(`${API_URL}/news/${id}`)
    fetchNews()
  }

  return (
    <div className="news-admin">

      {/* HEADER (как products-header) */}
      <div className="news-header-admin">

        <h2>📰 Новости</h2>

        <input
          placeholder="Поиск новостей..."
        />

        <button
          onClick={() => {
            setShowForm(p => !p)
            resetForm()
          }}
        >
          {showForm ? 'Закрыть' : 'Добавить'}
        </button>

      </div>

      {/* FORM (как product-form) */}
      {showForm && (
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

          {uploading && <p>Загрузка...</p>}

          {image && (
            <img src={`${API_URL}${image}`} alt="" />
          )}

          <button disabled={loading}>
            {editingId ? 'Обновить' : 'Создать'}
          </button>

        </form>
      )}

      {/* GRID (как products-grid) */}
      <div className="news-grid">

        {news.map(item => (
          <div key={item.id} className="news-card-admin">

            <img src={`${API_URL}${item.image}`} />

            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <div className="news-actions">

              <button onClick={() => edit(item)}>
                Редактировать
              </button>

              <button onClick={() => remove(item.id)}>
                Удалить
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}