import { useState, useEffect } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../../lib/firebase'

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName?: string
  membership: 'free' | 'paid'
  createdAt: string
  impact: {
    projectsFunded: number
    treesPlanted: number
    wasteCleaned: number
    carbonReduced: number
  }
  preferences?: {
    notifications: boolean
    newsletter: boolean
    projectCategories: string[]
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile)
          } else {
            // Create user profile if it doesn't exist
            const newProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              displayName: firebaseUser.displayName || '',
              membership: 'free',
              createdAt: new Date().toISOString(),
              impact: {
                projectsFunded: 0,
                treesPlanted: 0,
                wasteCleaned: 0,
                carbonReduced: 0
              },
              preferences: {
                notifications: true,
                newsletter: true,
                projectCategories: []
              }
            }
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile)
            setUserProfile(newProfile)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setAuthError(null)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error: any) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setAuthError(null)
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      })

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        id: userCredential.user.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        displayName: `${firstName} ${lastName}`,
        membership: 'free',
        createdAt: new Date().toISOString(),
        impact: {
          projectsFunded: 0,
          treesPlanted: 0,
          wasteCleaned: 0,
          carbonReduced: 0
        },
        preferences: {
          notifications: true,
          newsletter: true,
          projectCategories: []
        }
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile)
      
      return {
        success: true,
        user: userCredential.user,
        profile: userProfile
      }
    } catch (error: any) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUserProfile(null)
      return { success: true }
    } catch (error: any) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email: string) => {
    setAuthError(null)
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error: any) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    try {
      const userRef = doc(db, 'users', user.uid)
      
      // If updating display name, also update Firebase Auth
      if (updates.displayName) {
        await updateProfile(user, {
          displayName: updates.displayName
        })
      }
      
      // Update Firestore
      await setDoc(userRef, updates, { merge: true })
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updates } : null)
      
      return { success: true }
    } catch (error: any) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }
  }

  const upgradeMembership = async () => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    try {
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, { membership: 'paid' }, { merge: true })
      
      setUserProfile(prev => prev ? { ...prev, membership: 'paid' } : null)
      
      return { success: true }
    } catch (error: any) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }
  }

  const updateImpact = async (impactUpdates: Partial<UserProfile['impact']>) => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    try {
      const userRef = doc(db, 'users', user.uid)
      const currentImpact = userProfile?.impact || {
        projectsFunded: 0,
        treesPlanted: 0,
        wasteCleaned: 0,
        carbonReduced: 0
      }
      
      const updatedImpact = {
        ...currentImpact,
        ...impactUpdates
      }
      
      await setDoc(userRef, { impact: updatedImpact }, { merge: true })
      
      setUserProfile(prev => prev ? { ...prev, impact: updatedImpact } : null)
      
      return { success: true, impact: updatedImpact }
    } catch (error: any) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }
  }

  const addProjectToFollowed = async (projectId: string) => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    try {
      const userRef = doc(db, 'users', user.uid)
      const currentFollowed = userProfile?.preferences?.projectCategories || []
      
      if (!currentFollowed.includes(projectId)) {
        const updatedFollowed = [...currentFollowed, projectId]
        await setDoc(userRef, {
          'preferences.projectCategories': updatedFollowed
        }, { merge: true })
        
        setUserProfile(prev => prev ? {
          ...prev,
          preferences: {
            ...prev.preferences!,
            projectCategories: updatedFollowed
          }
        } : null)
      }
      
      return { success: true }
    } catch (error: any) {
      setAuthError(error.message)
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    userProfile,
    loading,
    error: authError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
    upgradeMembership,
    updateImpact,
    addProjectToFollowed
  }
}
