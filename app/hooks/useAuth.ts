import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth() {
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
const { data: { subscription } } = supabase.auth.onAuthStateChange(
(event, session) => {
setUser(session?.user ?? null)
setLoading(false)
}
)
return () => subscription.unsubscribe()
}, [])

const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
const response = await fetch('/api/auth/register', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password, firstName, lastName }),
})
return response.json()
}

const signIn = async (email: string, password: string) => {
const response = await fetch('/api/auth/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password }),
})
return response.json()
}

const signOut = async () => {
await fetch('/api/auth/logout', { method: 'POST' })
await supabase.auth.signOut()
}

return {
user,
loading,
signUp,
signIn,
signOut,
}
}
