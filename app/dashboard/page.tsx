'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../components/AuthProvider'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'

interface UserData {
firstName: string
lastName: string
membership: 'free' | 'paid'
impact: {
projectsFunded: number
treesPlanted: number
wasteCleaned: number
}
}

export default function DashboardPage() {
const router = useRouter()
const { user, loading } = useAuthContext()
const [userData, setUserData] = useState<UserData | null>(null)
const [dashboardLoading, setDashboardLoading] = useState(true)

useEffect(() => {
if (!loading && !user) {
router.push('/login')
}
}, [user, loading, router])

useEffect(() => {
const fetchUserData = async () => {
if (user) {
const userDoc = await getDoc(doc(db, 'users', user.uid))
if (userDoc.exists()) {
setUserData(userDoc.data() as UserData)
}
setDashboardLoading(false)
}
}

fetchUserData()
}, [user])

if (loading || dashboardLoading) {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-green mx-auto"></div>
<p className="mt-4 text-gray-600">Loading dashboard...</p>
</div>
</div>
)
}

return (
<div className="min-h-screen bg-gray-50">
<div className="container py-8">
{userData?.membership === 'free' ? (
<div className="max-w-6xl mx-auto">
<h1 className="text-3xl font-bold mb-8">Welcome back, {userData.firstName}!</h1>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2 space-y-8">
<div className="bg-white rounded-xl p-6 shadow-sm">
<h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
<div className="bg-gray-50 rounded-lg p-4">
<p className="text-gray-600 mb-2">No courses in progress</p>
<button className="px-4 py-2 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors">
Start Learning
</button>
</div>
</div>
<div className="bg-white rounded-xl p-6 shadow-sm">
<h2 className="text-xl font-semibold mb-4">Projects You're Following</h2>
<p className="text-gray-600">You're not following any projects yet.</p>
<button className="mt-4 px-4 py-2 border border-earth-green text-earth-green font-medium rounded-lg hover:bg-earth-green/10 transition-colors">
Browse Projects
</button>
</div>
<div className="bg-white rounded-xl p-6 shadow-sm">
<h2 className="text-xl font-semibold mb-4">Popular Projects Right Now</h2>
<div className="space-y-4">
{[1, 2, 3].map((i) => (
<div key={i} className="p-4 border rounded-lg">
<div className="flex justify-between items-start">
<div>
<h3 className="font-medium">Project {i}</h3>
<p className="text-sm text-gray-600">Project description</p>
</div>
<span className="text-sm text-gray-500">🔥 120 votes</span>
</div>
<p className="mt-2 text-sm text-amber-600">Upgrade to vote on this project</p>
</div>
))}
</div>
</div>
</div>
<div className="space-y-6">
<div className="bg-white rounded-xl p-6 shadow-sm">
<h3 className="font-semibold mb-4">Your Membership</h3>
<div className="space-y-3">
<div className="flex justify-between">
<span className="text-gray-600">Plan:</span>
<span className="font-medium">Free Account</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Projects funded:</span>
<span className="font-medium">{userData.impact.projectsFunded}</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Impact:</span>
<span className="font-medium">
{userData.impact.treesPlanted} trees • {userData.impact.wasteCleaned}kg waste
</span>
</div>
</div>
<button className="mt-6 w-full px-4 py-3 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors">
Upgrade to Paid
</button>
</div>
<div className="bg-earth-green/10 rounded-xl p-6">
<h3 className="font-semibold mb-3 text-earth-green">Ready for more impact?</h3>
<p className="text-sm text-gray-600 mb-4">
Upgrade to vote on projects, access all courses, and directly fund restoration work.
</p>
<button className="w-full px-4 py-2 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors">
Learn About Member Benefits
</button>
</div>
</div>
</div>
</div>
) : (
<div className="max-w-6xl mx-auto">
<div className="bg-gradient-to-r from-earth-green to-earth-teal rounded-2xl p-8 mb-8 text-white">
<h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.firstName}!</h1>
<p className="text-lg opacity-90">
Your membership directly funds: {userData?.impact.projectsFunded} projects
</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
<div className="bg-white rounded-xl p-6 shadow-sm">
<h3 className="font-semibold mb-4">Voting Power</h3>
<div className="space-y-4">
<div className="bg-amber-50 rounded-lg p-4">
<p className="text-amber-800 font-medium mb-2">Current Voting Round</p>
<p className="text-sm text-gray-600 mb-3">3 projects need your vote this quarter</p>
<p className="text-sm text-gray-500">Voting ends: Dec 31, 2024 • 1,240 members voted</p>
</div>
<button className="w-full px-4 py-3 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors">
Vote Now
</button>
</div>
</div>
<div className="bg-white rounded-xl p-6 shadow-sm">
<h3 className="font-semibold mb-4">Your Courses</h3>
<div className="space-y-4">
<div className="bg-gray-50 rounded-lg p-4">
<p className="font-medium mb-2">Composting Basics</p>
<div className="w-full bg-gray-200 rounded-full h-2 mb-2">
<div className="bg-earth-green h-2 rounded-full" style={{ width: '60%' }}></div>
</div>
<p className="text-sm text-gray-600">60% complete • 25 min remaining</p>
</div>
<button className="w-full px-4 py-2 border border-earth-green text-earth-green font-medium rounded-lg hover:bg-earth-green/10 transition-colors">
Go to Learning
</button>
</div>
</div>
<div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
<h3 className="font-semibold mb-4">Your Impact Dashboard</h3>
<div className="grid grid-cols-3 gap-4 mb-6">
<div className="bg-gray-50 rounded-lg p-4 text-center">
<p className="text-2xl font-bold text-earth-green">{userData?.impact.projectsFunded}</p>
<p className="text-sm text-gray-600">Projects Funded</p>
</div>
<div className="bg-gray-50 rounded-lg p-4 text-center">
<p className="text-2xl font-bold text-earth-green">{userData?.impact.treesPlanted}</p>
<p className="text-sm text-gray-600">Trees Planted</p>
</div>
<div className="bg-gray-50 rounded-lg p-4 text-center">
<p className="text-2xl font-bold text-earth-green">{userData?.impact.wasteCleaned}</p>
<p className="text-sm text-gray-600">kg Waste Cleaned</p>
</div>
</div>
<div className="space-y-4">
{[1, 2].map((i) => (
<div key={i} className="border rounded-lg p-4">
<div className="flex justify-between items-start">
<div>
<h4 className="font-medium">Project {i}</h4>
<p className="text-sm text-gray-600">Latest update: Project is progressing well</p>
</div>
<span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
Active
</span>
</div>
</div>
))}
</div>
</div>
</div>
<div className="bg-white rounded-xl p-6 shadow-sm">
<h3 className="font-semibold mb-4">Quick Actions</h3>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
<div className="text-earth-green font-medium">Find New Projects</div>
</button>
<button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
<div className="text-earth-green font-medium">Invite Friends</div>
</button>
<button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
<div className="text-earth-green font-medium">Ask a Question</div>
</button>
<button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
<div className="text-earth-green font-medium">Account Settings</div>
</button>
</div>
</div>
</div>
)}
</div>
</div>
)
}
