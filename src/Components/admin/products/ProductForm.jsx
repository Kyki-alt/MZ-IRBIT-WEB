import React, { useEffect, useState } from 'react'

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

    const priceNum = Number(price)

    // 5. цена > 0 (НЕ 0 и НЕ отрицательная)
    if (priceNum <= 0) {
      alert('Цена должна быть больше 0')
      return
    }

    const payload = {
      title,
      price: priceNum,
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

    setEditingProduct(null)
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
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${API_URL}/api/products/upload`, {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  setImg(data.imageUrl)
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