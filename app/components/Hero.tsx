export default function Hero() {
return (
<section className="relative overflow-hidden bg-gradient-to-br from-earth-green/10 via-earth-blue/5 to-earth-teal/10 py-20">
<div className="container relative z-10">
<div className="mx-auto max-w-3xl text-center">
<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
Take Direct Action to
<span className="block text-earth-green">Restore Our Planet</span>
</h1>
<p className="mt-6 text-lg text-gray-600">
Join a community that funds real projects. Learn practical skills. Vote on what gets done next.
</p>
<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
<button className="px-8 py-3 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors">
Explore Projects
</button>
<button className="px-8 py-3 border border-earth-green text-earth-green font-medium rounded-lg hover:bg-earth-green/10 transition-colors">
Join Today
</button>
</div>
</div>
</div>
</section>
)
}
