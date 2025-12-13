import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore'
import { db } from '../../../lib/firebase'

export interface Project {
  id: string
  title: string
  description: string
  shortDescription: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  fundingGoal: number
  currentFunding: number
  location: {
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  category: string[]
  deadline: string
  createdAt: string
  updatedAt: string
  organizationId: string
  organizationName: string
  impactMetrics: {
    treesPlanted?: number
    wasteCleaned?: number
    carbonReduced?: number
    peopleImpacted?: number
    areaRestored?: number
  }
  progress: number
  voteCount: number
  followers: number
  featured: boolean
  images: string[]
  updates: ProjectUpdate[]
  team: TeamMember[]
  budget: BudgetItem[]
  timeline: TimelineItem[]
}

export interface ProjectUpdate {
  id: string
  date: string
  title: string
  content: string
  images?: string[]
  metrics?: Record<string, number>
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
}

export interface BudgetItem {
  category: string
  amount: number
  description: string
}

export interface TimelineItem {
  date: string
  title: string
  description: string
  completed: boolean
}

interface ProjectFilters {
  status?: Project['status']
  category?: string
  location?: string
  featured?: boolean
  search?: string
  minFunding?: number
  maxFunding?: number
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [userProjects, setUserProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const fetchProjects = async (filters?: ProjectFilters) => {
    setLoading(true)
    setError(null)
    
    try {
      const projectsRef = collection(db, 'projects')
      let constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
      
      // Apply filters if provided
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status))
      }
      
      if (filters?.category) {
        constraints.push(where('category', 'array-contains', filters.category))
      }
      
      if (filters?.featured) {
        constraints.push(where('featured', '==', true))
      }
      
      if (filters?.location) {
        constraints.push(where('location.country', '==', filters.location))
      }
      
      if (filters?.minFunding !== undefined) {
        constraints.push(where('currentFunding', '>=', filters.minFunding))
      }
      
      if (filters?.maxFunding !== undefined) {
        constraints.push(where('currentFunding', '<=', filters.maxFunding))
      }
      
      const q = query(projectsRef, ...constraints)
      const querySnapshot = await getDocs(q)
      
      const projectsData: Project[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        projectsData.push({
          id: doc.id,
          ...data
        } as Project)
      })
      
      // Apply search filter if provided (client-side for simplicity)
      let filteredProjects = projectsData
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredProjects = projectsData.filter(project =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.location.city.toLowerCase().includes(searchTerm) ||
          project.location.country.toLowerCase().includes(searchTerm)
        )
      }
      
      setProjects(filteredProjects)
      
      // Also get featured projects
      const featuredQuery = query(projectsRef, where('featured', '==', true), limit(3))
      const featuredSnapshot = await getDocs(featuredQuery)
      const featuredData: Project[] = []
      featuredSnapshot.forEach((doc) => {
        const data = doc.data()
        featuredData.push({
          id: doc.id,
          ...data
        } as Project)
      })
      setFeaturedProjects(featuredData)
      
    } catch (error: any) {
      setError(error.message || 'Error fetching projects')
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProjects = async (userId: string) => {
    try {
      // In a real app, you'd have a collection of user-project relationships
      // For now, we'll fetch projects the user has voted on or followed
      const votesRef = collection(db, 'votes')
      const userVotesQuery = query(votesRef, where('userId', '==', userId))
      const votesSnapshot = await getDocs(userVotesQuery)
      
      const projectIds = votesSnapshot.docs.map(doc => doc.data().projectId)
      
      if (projectIds.length === 0) {
        setUserProjects([])
        return
      }
      
      // Fetch the actual projects (Note: Firestore doesn't support IN queries with array-contains-any for multiple fields)
      // For simplicity, we'll fetch them one by one
      const userProjectsData: Project[] = []
      
      for (const projectId of projectIds) {
        const projectDoc = await getDoc(doc(db, 'projects', projectId))
        if (projectDoc.exists()) {
          const data = projectDoc.data()
          userProjectsData.push({
            id: projectDoc.id,
            ...data
          } as Project)
        }
      }
      
      setUserProjects(userProjectsData)
    } catch (error: any) {
      console.error('Error fetching user projects:', error)
    }
  }

  const getProjectById = async (projectId: string) => {
    setLoading(true)
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId))
      
      if (projectDoc.exists()) {
        const projectData = {
          id: projectDoc.id,
          ...projectDoc.data()
        } as Project
        setSelectedProject(projectData)
        return projectData
      } else {
        setError('Project not found')
        return null
      }
    } catch (error: any) {
      setError(error.message || 'Error fetching project')
      console.error('Error fetching project:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const projectWithMetadata = {
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: Math.round((projectData.currentFunding / projectData.fundingGoal) * 100),
        voteCount: 0,
        followers: 0,
        featured: false
      }
      
      const docRef = await addDoc(collection(db, 'projects'), projectWithMetadata)
      
      // Fetch the newly created project
      const newProject = await getProjectById(docRef.id)
      
      // Update projects list
      await fetchProjects()
      
      return {
        success: true,
        projectId: docRef.id,
        project: newProject
      }
    } catch (error: any) {
      setError(error.message || 'Error creating project')
      console.error('Error creating project:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    setLoading(true)
    try {
      const projectRef = doc(db, 'projects', projectId)
      
      // If funding is updated, recalculate progress
      if (updates.currentFunding !== undefined || updates.fundingGoal !== undefined) {
        const currentProject = projects.find(p => p.id === projectId)
        if (currentProject) {
          const newFunding = updates.currentFunding ?? currentProject.currentFunding
          const newGoal = updates.fundingGoal ?? currentProject.fundingGoal
          updates.progress = Math.round((newFunding / newGoal) * 100)
        }
      }
      
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      
      // Update local state
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, ...updates } : null)
      }
      
      // Refresh projects list
      await fetchProjects()
      
      return { success: true }
    } catch (error: any) {
      setError(error.message || 'Error updating project')
      console.error('Error updating project:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    setLoading(true)
    try {
      await deleteDoc(doc(db, 'projects', projectId))
      
      // Update local state
      setProjects(prev => prev.filter(p => p.id !== projectId))
      setFeaturedProjects(prev => prev.filter(p => p.id !== projectId))
      
      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
      }
      
      return { success: true }
    } catch (error: any) {
      setError(error.message || 'Error deleting project')
      console.error('Error deleting project:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const voteForProject = async (projectId: string, userId: string) => {
    try {
      // Check if user already voted
      const votesRef = collection(db, 'votes')
      const userVoteQuery = query(
        votesRef,
        where('projectId', '==', projectId),
        where('userId', '==', userId)
      )
      const existingVotes = await getDocs(userVoteQuery)
      
      if (!existingVotes.empty) {
        return { success: false, error: 'User already voted for this project' }
      }
      
      // Add vote
      await addDoc(votesRef, {
        projectId,
        userId,
        votedAt: new Date().toISOString()
      })
      
      // Update project vote count
      const projectRef = doc(db, 'projects', projectId)
      const projectDoc = await getDoc(projectRef)
      
      if (projectDoc.exists()) {
        const currentVotes = projectDoc.data().voteCount || 0
        await updateDoc(projectRef, {
          voteCount: currentVotes + 1
        })
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Error voting for project:', error)
      return { success: false, error: error.message }
    }
  }

  const followProject = async (projectId: string, userId: string) => {
    try {
      // Add to user's followed projects
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const currentFollowed = userDoc.data().followedProjects || []
        if (!currentFollowed.includes(projectId)) {
          await updateDoc(userRef, {
            followedProjects: [...currentFollowed, projectId]
          })
        }
      }
      
      // Update project follower count
      const projectRef = doc(db, 'projects', projectId)
      const projectDoc = await getDoc(projectRef)
      
      if (projectDoc.exists()) {
        const currentFollowers = projectDoc.data().followers || 0
        await updateDoc(projectRef, {
          followers: currentFollowers + 1
        })
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Error following project:', error)
      return { success: false, error: error.message }
    }
  }

  const addProjectUpdate = async (projectId: string, update: Omit<ProjectUpdate, 'id'>) => {
    try {
      const projectRef = doc(db, 'projects', projectId)
      const projectDoc = await getDoc(projectRef)
      
      if (projectDoc.exists()) {
        const currentUpdates = projectDoc.data().updates || []
        const newUpdate = {
          id: Date.now().toString(), // Simple ID generation
          ...update
        }
        
        await updateDoc(projectRef, {
          updates: [...currentUpdates, newUpdate],
          updatedAt: new Date().toISOString()
        })
        
        return { success: true, update: newUpdate }
      }
      
      return { success: false, error: 'Project not found' }
    } catch (error: any) {
      console.error('Error adding project update:', error)
      return { success: false, error: error.message }
    }
  }

  // Real-time listener for projects
  const subscribeToProjects = (filters?: ProjectFilters) => {
    const projectsRef = collection(db, 'projects')
    let constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
    
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status))
    }
    
    if (filters?.featured) {
      constraints.push(where('featured', '==', true))
    }
    
    const q = query(projectsRef, ...constraints)
    
    return onSnapshot(q, (querySnapshot) => {
      const projectsData: Project[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        projectsData.push({
          id: doc.id,
          ...data
        } as Project)
      })
      
      setProjects(projectsData)
      setLoading(false)
    }, (error) => {
      setError(error.message)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    featuredProjects,
    userProjects,
    loading,
    error,
    selectedProject,
    fetchProjects,
    fetchUserProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    voteForProject,
    followProject,
    addProjectUpdate,
    subscribeToProjects,
    refreshProjects: () => fetchProjects()
  }
}
