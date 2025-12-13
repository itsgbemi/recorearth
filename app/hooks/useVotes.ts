import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../../../lib/firebase'

interface Vote {
  id: string
  userId: string
  projectId: string
  votedAt: string
  quarter: string // e.g., "Q2-2024"
}

export function useVotes() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [userVotes, setUserVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentQuarter = () => {
    const now = new Date()
    const quarter = Math.floor((now.getMonth() + 3) / 3)
    const year = now.getFullYear()
    return `Q${quarter}-${year}`
  }

  const fetchVotes = async (projectId?: string) => {
    setLoading(true)
    try {
      const votesRef = collection(db, 'votes')
      let q
      
      if (projectId) {
        q = query(votesRef, where('projectId', '==', projectId))
      } else {
        q = query(votesRef)
      }
      
      const querySnapshot = await getDocs(q)
      const votesData: Vote[] = []
      querySnapshot.forEach((doc) => {
        votesData.push({
          id: doc.id,
          ...doc.data()
        } as Vote)
      })
      
      setVotes(votesData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserVotes = async (userId: string, quarter?: string) => {
    setLoading(true)
    try {
      const votesRef = collection(db, 'votes')
      let q = query(votesRef, where('userId', '==', userId))
      
      if (quarter) {
        q = query(votesRef, where('userId', '==', userId), where('quarter', '==', quarter))
      }
      
      const querySnapshot = await getDocs(q)
      const userVotesData: Vote[] = []
      querySnapshot.forEach((doc) => {
        userVotesData.push({
          id: doc.id,
          ...doc.data()
        } as Vote)
      })
      
      setUserVotes(userVotesData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const submitVote = async (userId: string, projectId: string) => {
    try {
      const currentQuarter = getCurrentQuarter()
      
      // Check if user already voted this quarter
      const userVotesQuery = query(
        collection(db, 'votes'),
        where('userId', '==', userId),
        where('quarter', '==', currentQuarter)
      )
      const existingVotes = await getDocs(userVotesQuery)
      
      // In a real app, you might limit votes per quarter
      // For now, we'll allow multiple votes
      
      const voteData: Omit<Vote, 'id'> = {
        userId,
        projectId,
        votedAt: new Date().toISOString(),
        quarter: currentQuarter
      }
      
      const docRef = await addDoc(collection(db, 'votes'), voteData)
      
      // Update local state
      const newVote: Vote = {
        id: docRef.id,
        ...voteData
      }
      
      setVotes(prev => [...prev, newVote])
      setUserVotes(prev => [...prev, newVote])
      
      return { success: true, voteId: docRef.id }
    } catch (error: any) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const removeVote = async (voteId: string) => {
    try {
      await deleteDoc(doc(db, 'votes', voteId))
      
      // Update local state
      setVotes(prev => prev.filter(vote => vote.id !== voteId))
      setUserVotes(prev => prev.filter(vote => vote.id !== voteId))
      
      return { success: true }
    } catch (error: any) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const getVoteCount = (projectId: string) => {
    return votes.filter(vote => vote.projectId === projectId).length
  }

  const getUserVoteCount = (userId: string, quarter?: string) => {
    if (quarter) {
      return userVotes.filter(vote => vote.userId === userId && vote.quarter === quarter).length
    }
    return userVotes.filter(vote => vote.userId === userId).length
  }

  const hasUserVotedForProject = (userId: string, projectId: string) => {
    return userVotes.some(vote => vote.userId === userId && vote.projectId === projectId)
  }

  // Real-time subscription
  const subscribeToVotes = (projectId?: string) => {
    const votesRef = collection(db, 'votes')
    let q
    
    if (projectId) {
      q = query(votesRef, where('projectId', '==', projectId))
    } else {
      q = query(votesRef)
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const votesData: Vote[] = []
      querySnapshot.forEach((doc) => {
        votesData.push({
          id: doc.id,
          ...doc.data()
        } as Vote)
      })
      setVotes(votesData)
    }, (error) => {
      setError(error.message)
    })
  }

  useEffect(() => {
    fetchVotes()
  }, [])

  return {
    votes,
    userVotes,
    loading,
    error,
    fetchVotes,
    fetchUserVotes,
    submitVote,
    removeVote,
    getVoteCount,
    getUserVoteCount,
    hasUserVotedForProject,
    subscribeToVotes,
    getCurrentQuarter
  }
}
