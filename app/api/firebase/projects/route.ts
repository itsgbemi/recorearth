import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebase-admin'

export async function GET(request: NextRequest) {
try {
const searchParams = request.nextUrl.searchParams
const status = searchParams.get('status')
const category = searchParams.get('category')
const featured = searchParams.get('featured')
const limit = searchParams.get('limit') || '50'

let query = adminDb.collection('projects').orderBy('createdAt', 'desc')

if (status) {
query = query.where('status', '==', status)
}

if (category) {
query = query.where('category', 'array-contains', category)
}

if (featured === 'true') {
query = query.where('featured', '==', true)
}

if (limit) {
query = query.limit(parseInt(limit))
}

const snapshot = await query.get()
const projects = snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}))

return NextResponse.json(projects)
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}

export async function POST(request: NextRequest) {
try {
const body = await request.json()
const projectData = {
...body,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString(),
voteCount: 0,
followers: 0,
progress: Math.round((body.currentFunding / body.fundingGoal) * 100)
}

const docRef = await adminDb.collection('projects').add(projectData)

return NextResponse.json({
id: docRef.id,
...projectData
}, { status: 201 })
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}
