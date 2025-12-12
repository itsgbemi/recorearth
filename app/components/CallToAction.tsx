import Button from './ui/Button'

export default function CallToAction() {
return (
<section className="py-20">
<div className="container">
<div className="max-w-4xl mx-auto text-center">
<h2 className="text-3xl font-bold mb-4">Ready to help decide what gets done?</h2>
<p className="text-lg text-gray-600 mb-8">
Join thousands of members who are taking direct, measurable action.
You can see the projects. You can learn the skills. You can help decide what gets done.
</p>
<div className="bg-gray-50 rounded-2xl p-8 mb-8">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
<div>
<h3 className="font-semibold text-lg mb-2">Free Account</h3>
<ul className="space-y-2 text-gray-600">
<li>✓ Browse all projects</li>
<li>✓ Try basic learning tools</li>
<li>✓ Follow organizations</li>
</ul>
</div>
<div>
<h3 className="font-semibold text-lg mb-2">Paid Membership ($9/month)</h3>
<ul className="space-y-2 text-gray-600">
<li>✓ Vote on projects</li>
<li>✓ Take all courses</li>
<li>✓ Your fee funds the work</li>
</ul>
</div>
</div>
</div>
<button className="px-8 py-4 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors text-lg">
Become a Funding Member
</button>
</div>
</div>
</section>
)
}
