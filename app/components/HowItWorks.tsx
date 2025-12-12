import { Search, Vote, TrendingUp } from 'lucide-react'
import Card from './ui/Card'

const steps = [
{
icon: Search,
title: 'Discover Projects',
description: 'Browse our global database of real projects. See what\'s being done, what needs funding, and what\'s already completed.',
},
{
icon: Vote,
title: 'Vote & Direct',
description: 'Members decide which projects get funded each quarter. You\'re not a donor; you\'re a stakeholder.',
},
{
icon: TrendingUp,
title: 'Track Impact',
description: 'See exactly where the money goes and what it achieves. Follow progress from planning to completion.',
},
]

export default function HowItWorks() {
return (
<section className="py-20">
<div className="container">
<h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{steps.map((step, index) => (
<Card key={index} className="text-center p-6">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-earth-green/10 mb-4">
<step.icon className="w-6 h-6 text-earth-green" />
</div>
<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
<p className="text-gray-600">{step.description}</p>
</Card>
))}
</div>
</div>
</section>
)
}
