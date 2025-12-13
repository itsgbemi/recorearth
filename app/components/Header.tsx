'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { useAuthContext } from './AuthProvider'

export default function Header() {
const router = useRouter()
const { user, signOut } = useAuthContext()

const handleSignOut = async () => {
await signOut()
router.push('/')
router.refresh()
}

return (
<header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
<div className="container flex h-16 items-center justify-between">
<div className="flex items-center gap-2">
<Link href="/" className="flex items-center gap-2">
<Leaf className="h-8 w-8 text-earth-green" />
<span className="text-xl font-bold">EarthRestorers</span>
</Link>
</div>
<nav className="hidden md:flex gap-6">
<Link href="/projects" className="text-sm font-medium hover:text-earth-green transition-colors">Projects</Link>
<Link href="/courses" className="text-sm font-medium hover:text-earth-green transition-colors">Courses</Link>
<Link href="/about" className="text-sm font-medium hover:text-earth-green transition-colors">About</Link>
</nav>
<div className="flex items-center gap-4">
{user ? (
<>
<Link href="/dashboard" className="text-sm font-medium hover:text-earth-green transition-colors">Dashboard</Link>
<button
onClick={handleSignOut}
className="px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
>
Sign Out
</button>
</>
) : (
<>
<Link href="/login" className="text-sm font-medium hover:text-earth-green transition-colors">Login</Link>
<Link href="/signup" className="px-4 py-2 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors">
Sign Up
</Link>
</>
)}
</div>
</div>
</header>
)
}
