'use client'
import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../lib/firebase'

export default function ForgotPasswordPage() {
const [email, setEmail] = useState('')
const [message, setMessage] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setLoading(true)
setError('')
setMessage('')

try {
await sendPasswordResetEmail(auth, email)
setMessage('Password reset email sent! Check your inbox.')
setEmail('')
} catch (error: any) {
setError(error.message || 'Failed to send reset email')
} finally {
setLoading(false)
}
}

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-earth-blue/5 to-earth-teal/5 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8">
<div className="text-center">
<h1 className="text-3xl font-bold">Reset your password</h1>
<p className="mt-2 text-gray-600">Enter your email address and we'll send you a reset link.</p>
</div>
<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
<div className="rounded-md shadow-sm">
<div>
<label htmlFor="email" className="sr-only">Email address</label>
<input
id="email"
name="email"
type="email"
autoComplete="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green focus:border-transparent"
placeholder="Email address"
/>
</div>
</div>
{error && (
<div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
{error}
</div>
)}
{message && (
<div className="bg-green-50 text-green-500 p-3 rounded-lg text-sm">
{message}
</div>
)}
<div>
<button
type="submit"
disabled={loading}
className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-earth-green hover:bg-earth-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-green disabled:opacity-50 disabled:cursor-not-allowed"
>
{loading ? 'Sending...' : 'Send reset link'}
</button>
</div>
</form>
</div>
</div>
)
}
