import { useState, useEffect } from 'react'
import { auth } from '../services/supabase'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null)
      setLoading(false)
    })

    const { data } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      data?.subscription?.unsubscribe()
    }
  }, [])

  return { user, loading }
}
