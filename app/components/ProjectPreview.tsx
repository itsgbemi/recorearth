import Card from './ui/Card'

const projects = [
{
title: 'Urban Garden Network',
status: '65% funded',
progress: 65,
amount: '$8,500 of $13,000',
timeLeft: '5 days',
},
{
title: 'River Cleanup Initiative',
status: '42% funded',
progress: 42,
amount: '$4,200 of $10,000',
timeLeft: '3 days',
},
{
title: 'Reforestation Program',
status: 'Completed',
progress: 100,
amount: '10,000 trees planted',
timeLeft: '✓',
},
]

export default function ProjectPreview() {
return (
<section className="py-20 bg-gray-50">
<div className="container">
<h2 className="text-3xl font-bold text-center mb-12">Live Project Preview</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{projects.map((project, index) => (
<Card key={index} className="p-6">
<h3 className="text-lg font-semibold mb-2">{project.title}</h3>
<div className="flex items-center justify-between mb-2">
<span className="text-sm font-medium text-gray-700">{project.status}</span>
<span className="text-sm text-gray-600">{project.amount}</span>
</div>
<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
<div
className="bg-earth-green h-2 rounded-full"
style={{ width: `${project.progress}%` }}
></div>
</div>
<div className="flex justify-between items-center">
<span className="text-sm text-gray-600">
{project.timeLeft === '✓' ? 'Completed' : `Vote ends in: ${project.timeLeft}`}
</span>
<button className="text-sm font-medium text-earth-green hover:text-earth-green/80">
View Details →
</button>
</div>
</Card>
))}
</div>
<div className="text-center mt-10">
<button className="px-6 py-3 bg-earth-green text-white font-medium rounded-lg hover:bg-earth-green/90 transition-colors">
View All 200+ Projects
</button>
</div>
</div>
</section>
)
}
