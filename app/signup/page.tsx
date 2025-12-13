'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
export default function SignUpPage() {
const router = useRouter()
const [loading, setLoading] = useState(false)
const [formData, setFormData] = useState({
firstName: '',
lastName: '',
email: '',
password: '',
confirmPassword: '',
})
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setLoading(true)
setError('')
setSuccess('')
if (formData.password !== formData.confirmPassword) {
setError('Passwords do not match')
setLoading(false)
return
}
try {
const { data, error } = await supabase.auth.signUp({
email: formData.email,
password: formData.password,
options: {
data: {
first_name: formData.firstName,
last_name: formData.lastName,
}
}
})
if (error) throw error
if (data.user) {
setSuccess('Registration successful! Please check your email to confirm your account.')
setFormData({
firstName: '',
lastName: '',
email: '',
password: '',
confirmPassword: '',
})
}
} catch (error: any) {
setError(error.message || 'Registration failed')
} finally {
setLoading(false)
}
}
const handleGoogleSignUp = async () => {
try {
const { error } = await supabase.auth.signInWithOAuth({
provider: 'google',
options: {
redirectTo: ${window.location.origin}/auth/callback,
},
})
if (error) throw error
} catch (error: any) {
setError(error.message)
}
}
return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-earth-green/5 to-earth-teal/5 py-12 px-4 sm:px-6 lg:px-8"> <div className="max-w-md w-full space-y-8"> <div className="text-center"> <h1 className="text-3xl font-bold">Join EarthRestorers</h1> <p className="mt-2 text-gray-600">Create your account and start making an impact</p> </div> <form className="mt-8 space-y-6" onSubmit={handleSubmit}> <div className="rounded-md shadow-sm space-y-4"> <div className="grid grid-cols-2 gap-4"> <div> <label htmlFor="first-name" className="sr-only"> First name </label> <input id="first-name" name="first-name" type="text" autoComplete="given-name" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green focus:border-transparent" placeholder="First name" /> </div> <div> <label htmlFor="last-name" className="sr-only"> Last name </label> <input id="last-name" name="last-name" type="text" autoComplete="family-name" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green focus:border-transparent" placeholder="Last name" /> </div> </div> <div> <label htmlFor="email" className="sr-only"> Email address </label> <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green focus:border-transparent" placeholder="Email address" /> </div> <div> <label htmlFor="password" className="sr-only"> Password </label> <input id="password" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green focus:border-transparent" placeholder="Password" /> </div> <div> <label htmlFor="confirm-password" className="sr-only"> Confirm password </label> <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green focus:border-transparent" placeholder="Confirm password" /> </div> </div> {error && ( <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm"> {error} </div> )} {success && ( <div className="bg-green-50 text-green-500 p-3 rounded-lg text-sm"> {success} </div> )} <div className="flex items-center"> <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-earth-green focus:ring-earth-green border-gray-300 rounded" /> <label htmlFor="terms" className="ml-2 block text-sm text-gray-900"> I agree to the <Link href="/terms" className="text-earth-green hover:text-earth-green/80">Terms of Service</Link> and <Link href="/privacy" className="text-earth-green hover:text-earth-green/80">Privacy Policy</Link> </label> </div> <div> <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-earth-green hover:bg-earth-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-green disabled:opacity-50 disabled:cursor-not-allowed" > {loading ? 'Creating Account...' : 'Create Account'} </button> </div> <div className="text-center text-sm"> <span className="text-gray-600">Already have an account? </span> <Link href="/login" className="font-medium text-earth-green hover:text-earth-green/80"> Sign in </Link> </div> <div className="relative mt-6"> <div className="absolute inset-0 flex items-center"> <div className="w-full border-t border-gray-300" /> </div> <div className="relative flex justify-center text-sm"> <span className="px-2 bg-white text-gray-500">Or sign up with</span> </div> </div> <div className="mt-6"> <button type="button" onClick={handleGoogleSignUp} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" > <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"> <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/> </svg> Sign up with Google </button> </div> </form> </div> </div> ) }
