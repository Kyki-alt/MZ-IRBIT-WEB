import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

export default function AdminLogin() {

  const navigate = useNavigate()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {

    if (!login || !password) {
      setError('Заполните все поля')
      return
    }

    try {

      setLoading(true)
      setError('')

      const res = await axios.post(
        'https://ТВОЙ-БЭКЕНД/admin/login',
        {
          login,
          password
        }
      )

      localStorage.setItem(
        'adminToken',
        res.data.token
      )

      navigate('/admin')

    } catch (err) {

      setError('Неверный логин или пароль')

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="admin-login-page">

      <div className="admin-login-card">

        <h1>
          Вход в админку
        </h1>

        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) =>
            setLogin(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? 'Вход...'
            : 'Войти'}
        </button>

      </div>

    </div>
  )
}