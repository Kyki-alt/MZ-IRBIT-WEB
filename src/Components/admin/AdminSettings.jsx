import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API_URL from '../../config'
import './AdminSettings.css'

export default function AdminSettings() {

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('adminToken')

  const fetchAdmins = async () => {
    const res = await axios.get(`${API_URL}/admin/list`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setAdmins(res.data)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const createAdmin = async () => {
    if (!login || !password) return alert('Заполните поля')

    setLoading(true)

    await axios.post(
      `${API_URL}/admin/create`,
      { login, password },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setLogin('')
    setPassword('')
    fetchAdmins()

    setLoading(false)
  }

  return (
    <div className="admin-settings">

      <h2>⚙️ Управление администраторами</h2>

      {/* FORM */}
      <div className="admin-form">

        <input
          placeholder="Логин"
          value={login}
          onChange={e => setLogin(e.target.value)}
        />

        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={createAdmin}
          disabled={loading}
        >
          {loading ? 'Создание...' : 'Создать админа'}
        </button>

      </div>

      {/* LIST */}
      <div className="admin-list">

        {admins.map(admin => (
          <div key={admin.id} className="admin-card">

            <div>
              <h3>{admin.login}</h3>
              <p>ID: {admin.id}</p>
            </div>

            <span className="admin-date">
              {new Date(admin.created_at).toLocaleString()}
            </span>

          </div>
        ))}

      </div>

    </div>
  )
}