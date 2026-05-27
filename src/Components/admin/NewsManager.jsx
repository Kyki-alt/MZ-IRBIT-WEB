import { useEffect, useState } from 'react'
import axios from 'axios'
import API_URL from '../../config'

export default function NewsManager() {

  const [news, setNews] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)

  const fetchNews = async () => {
    const res = await axios.get(`${API_URL}/news`)
    setNews(res.data)
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const uploadImage = async () => {

    const formData = new FormData()
    formData.append('image', image)

    const res = await axios.post(
      `${API_URL}/news/upload`,
      formData
    )

    return res.data.imageUrl
  }

  const createNews = async () => {

    let imageUrl = ''

    if (image) {
      imageUrl = await uploadImage()
    }

    await axios.post(`${API_URL}/news`, {
      title,
      description,
      image: imageUrl
    })

    setTitle('')
    setDescription('')
    setImage(null)

    fetchNews()
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>📰 Добавить новость</h2>

      <input
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br /><br />

      <button onClick={createNews}>
        ➕ Добавить
      </button>

      <hr />

      <h3>Список новостей</h3>

      {news.map(n => (
        <div key={n.id} style={{ marginBottom: 10 }}>
          <b>{n.title}</b>
          <p>{n.description}</p>
        </div>
      ))}

    </div>
  )
}