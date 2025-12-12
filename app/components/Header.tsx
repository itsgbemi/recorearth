import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function Header() {
return (
<header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
<div className="container flex h-16 items-center justify-between">
<div className="flex items-center gap-2">
<Leaf className="h-8 w-8 text-earth-green" />
<span className="text-xl font-bold">EarthRestorers</span>
</div>
<nav className="hidden md:flex gap-6">
<Link href="/projects" className="text-sm font-medium hover:text-earth-green transition-colors">Projects</Link>
<Link href="/courses" className="text-sm font-medium hover:text-earth-green transition-colors">Courses</Link>
<Link href="/about" className="text-sm font-medium hover:text-earth-green transition-colors">About</Link>
</nav>
<div className="flex items-center gap-4">
<Link href="/login" className="text-sm font-medium hover:text-earth-green transition-colors">Login</Link>
<button className="px-4 py-2 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors">
Sign Up
</button>
</div>
</div>
</header>
)
}
