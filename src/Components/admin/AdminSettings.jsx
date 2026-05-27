import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API_URL from '../../config'

export default function AdminSettings() {

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [admins, setAdmins] = useState([])

  const token = localStorage.getItem('adminToken')

  const fetchAdmins = async () => {
    const res = await axios.get(
      `${API_URL}/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setAdmins(res.data)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const createAdmin = async () => {
    try {
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

    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка')
    }
  }

  return (
    <div className="admin-settings">

      <h2>👤 Создать админа</h2>

      <div className="form">
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

        <button onClick={createAdmin}>
          Создать
        </button>
      </div>

      <hr />

      <h3>Список админов</h3>

      {admins.map(a => (
        <div key={a.id} className="admin-item">
          <b>{a.login}</b>
          <span>{new Date(a.created_at).toLocaleString()}</span>
        </div>
      ))}

    </div>
  )
}