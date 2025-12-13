import { useEffect, useState } from 'react'
interface Project {
id: string
title: string
description: string
status: string
funding_goal: number
current_funding: number
location: string
category: string
deadline: string
}
export function useProjects() {
const [projects, setProjects] = useState<Project[]>([])
const [loading, setLoading] = useState(true)
useEffect(() => {
fetchProjects()
}, [])
const fetchProjects = async () => {
try {
const response = await fetch('/api/projects')
const data = await response.json()
setProjects(data)
} catch (error) {
console.error('Error fetching projects:', error)
} finally {
setLoading(false)
}
}
const createProject = async (projectData: Omit<Project, 'id'>) => {
const response = await fetch('/api/projects', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(projectData),
})
return response.json()
}
return {
projects,
loading,
createProject,
refreshProjects: fetchProjects,
}
}
