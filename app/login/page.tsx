'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../lib/firebase'

export default function LoginPage() {
const router = useRouter()
const [loading, setLoading] = useState(false)
const [formData, setFormData] = useState({
email: '',
password: '',
})
const [error, setError] = useState('')

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setLoading(true)
setError('')

try {
const userCredential = await signInWithEmailAndPassword(
auth,
formData.email,
formData.password
)
if (userCredential.user) {
router.push('/dashboard')
router.refresh()
}
} catch (error: any) {
setError(error.message || 'Login failed')
} finally {
setLoading(false)
}
}

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-earth-green/5 to-earth-blue/5 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8">
<div className="text-center">
<h1 className="text-3xl font-bold">Welcome Back</h1>
<p className="mt-2 text-gray-600">Sign in to your EarthRestorers account</p>
</div>
<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
<div className="rounded-md shadow-sm space-y-4">
<div>
<label htmlFor="email" className="sr-only">
Email address
</label>
<input
id="email"
name="email"
type="email"
autoComplete="email"
required
value={formData.email}
onChange={(e) => setFormData({...formData, email: e.target.value})}
className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green focus:border-transparent"
placeholder="Email address"
/>
</div>
<div>
<label htmlFor="password" className="sr-only">
Password
</label>
<input
id="password"
name="password"
type="password"
autoComplete="current-password"
required
value={formData.password}
onChange={(e) => setFormData({...formData, password: e.target.value})}
className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green focus:border-transparent"
placeholder="Password"
/>
</div>
</div>
{error && (
<div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
{error}
</div>
)}
<div className="flex items-center justify-between">
<div className="flex items-center">
<input
id="remember-me"
name="remember-me"
type="checkbox"
className="h-4 w-4 text-earth-green focus:ring-earth-green border-gray-300 rounded"
/>
<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
Remember me
</label>
</div>
<div className="text-sm">
<Link href="/forgot-password" className="font-medium text-earth-green hover:text-earth-green/80">
Forgot your password?
</Link>
</div>
</div>
<div>
<button
type="submit"
disabled={loading}
className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-earth-green hover:bg-earth-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-green disabled:opacity-50 disabled:cursor-not-allowed"
>
{loading ? 'Signing in...' : 'Sign in'}
</button>
</div>
<div className="text-center text-sm">
<span className="text-gray-600">Don't have an account? </span>
<Link href="/signup" className="font-medium text-earth-green hover:text-earth-green/80">
Sign up
</Link>
</div>
</form>
</div>
</div>
)
}
