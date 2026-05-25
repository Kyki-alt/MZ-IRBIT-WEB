import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

export default function ProtectedRoute({
  children
}) {

  const [isLoading, setIsLoading] =
    useState(true)

  const [isAuth, setIsAuth] =
    useState(false)

  useEffect(() => {

    const checkAuth = async () => {

      const token =
        localStorage.getItem(
          'adminToken'
        )

      if (!token) {
        setIsLoading(false)
        return
      }

      try {

        await axios.get(
          'https://mz-irbit.onrender.com/admin/check',
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        setIsAuth(true)

      } catch (err) {

        localStorage.removeItem(
          'adminToken'
        )

        setIsAuth(false)

      } finally {

        setIsLoading(false)

      }
    }

    checkAuth()

  }, [])

  if (isLoading) {
    return <h2>Проверка доступа...</h2>
  }

  if (!isAuth) {
    return (
      <Navigate to="/admin/login" />
    )
  }

  return children
}