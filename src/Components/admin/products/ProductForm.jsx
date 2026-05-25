import React, { useEffect, useState } from 'react'
import API_URL from '../../../config'
import axios from 'axios'

export default function ProductForm({
  addProduct,
  updateProduct,
  editingProduct,
  setEditingProduct
}) {

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [is_active, setIsActive] = useState(true)
  const [img, setImg] = useState('')
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [imgLoading, setImgLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title || '')
      setPrice(editingProduct.price ?? '')
      setStock(editingProduct.stock ?? '')
      setDescription(editingProduct.description || '')
      setIsActive(editingProduct.is_active ?? true)
      setImg(editingProduct.img || '')
    } else {
      setTitle('')
      setPrice('')
      setStock('')
      setDescription('')
      setIsActive(true)
      setImg('')
    }
  }, [editingProduct])

const handleSubmit = (e) => {
  e.preventDefault()

  if (imgLoading) return

  if (!img) {
    alert('Добавь фото')
    return
  }

  const payload = {
    title,
    price: Number(price),
    stock: Number(stock),
    description,
    is_active,
    category_id: categoryId,
    img
  }

  if (editingProduct) {
    updateProduct(editingProduct.id, payload)
  } else {
    addProduct(payload)
  }
}

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/api/products/categories`)
    const data = await res.json()
    setCategories(data)
  }

const uploadImage = async (file) => {
  setImgLoading(true)
  setUploadProgress(0)

  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await axios.post(
      `${API_URL}/api/products/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(percent)
        }
      }
    )

    setImg(res.data.imageUrl)

  } catch (err) {
    console.error('Upload error:', err)
  } finally {
    setImgLoading(false)
  }
}



  return (
    <form className="product-form" onSubmit={handleSubmit}>


      <input
        type="text"
        placeholder="Название товара"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        >
        <option value="">Выберите категорию</option>

        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.key_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Цена"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="1"
        required
      />

      <input
        type="number"
        placeholder="Количество"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        min="0"
      />

    {/* 2. ФОТО ТОВАРА */}
    <input
      type="file"
      onChange={(e) => uploadImage(e.target.files[0])}
    />

    {/* 🔥 PROGRESS BAR */}
    {imgLoading && (
      <div style={{
        width: '100%',
        height: 8,
        background: '#eee',
        borderRadius: 5,
        marginTop: 10
      }}>
        <div
          style={{
            width: `${uploadProgress}%`,
            height: '100%',
            background: '#4caf50',
            borderRadius: 5,
            transition: 'width 0.2s'
          }}
        />
      </div>
    )}

    {/* PREVIEW */}
    {img && (
      <img
        src={img}
        alt="preview"
        style={{ width: 100, marginTop: 10, borderRadius: 8 }}
      />
    )}

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={is_active}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        В наличии
      </label>

      <button type="submit">
        {editingProduct ? 'Обновить' : 'Создать'}
      </button>
    </form>
  )
}