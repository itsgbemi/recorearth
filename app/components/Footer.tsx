import { Leaf } from 'lucide-react'

export default function Footer() {
return (
<footer className="border-t bg-gray-50">
<div className="container py-10">
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
<div className="space-y-4">
<div className="flex items-center gap-2">
<Leaf className="h-6 w-6 text-earth-green" />
<span className="text-lg font-bold">EarthRestorers</span>
</div>
<p className="text-sm text-gray-600">
Together, we fund and build a healthier planet.
</p>
</div>
<div>
<h4 className="font-semibold mb-4">Platform</h4>
<ul className="space-y-2 text-sm text-gray-600">
<li><a href="/projects" className="hover:text-earth-green">Projects</a></li>
<li><a href="/courses" className="hover:text-earth-green">Courses</a></li>
<li><a href="/about" className="hover:text-earth-green">About</a></li>
</ul>
</div>
<div>
<h4 className="font-semibold mb-4">Resources</h4>
<ul className="space-y-2 text-sm text-gray-600">
<li><a href="/faq" className="hover:text-earth-green">FAQ</a></li>
<li><a href="/transparency" className="hover:text-earth-green">Transparency</a></li>
<li><a href="/contact" className="hover:text-earth-green">Contact</a></li>
</ul>
</div>
<div>
<h4 className="font-semibold mb-4">Legal</h4>
<ul className="space-y-2 text-sm text-gray-600">
<li><a href="/privacy" className="hover:text-earth-green">Privacy Policy</a></li>
<li><a href="/terms" className="hover:text-earth-green">Terms of Service</a></li>
<li><a href="/cookies" className="hover:text-earth-green">Cookie Policy</a></li>
</ul>
</div>
</div>
<div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
© {new Date().getFullYear()} EarthRestorers. All rights reserved.
</div>
</div>
</footer>
)
}
