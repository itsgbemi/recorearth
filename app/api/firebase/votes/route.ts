import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebase-admin'

export async function GET(request: NextRequest) {
try {
const searchParams = request.nextUrl.searchParams
const projectId = searchParams.get('projectId')
const userId = searchParams.get('userId')

let query = adminDb.collection('votes')

if (projectId) {
query = query.where('projectId', '==', projectId)
}

if (userId) {
query = query.where('userId', '==', userId)
}

const snapshot = await query.get()
const votes = snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}))

return NextResponse.json(votes)
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}

export async function POST(request: NextRequest) {
try {
const body = await request.json()
const { projectId, userId } = body

if (!projectId || !userId) {
return NextResponse.json(
{ error: 'Missing projectId or userId' },
{ status: 400 }
)
}

const currentQuarter = getCurrentQuarter()

const existingVotes = await adminDb
.collection('votes')
.where('userId', '==', userId)
.where('quarter', '==', currentQuarter)
.get()

if (existingVotes.size >= 3) {
return NextResponse.json(
{ error: 'Maximum 3 votes per quarter allowed' },
{ status: 400 }
)
}

const voteData = {
projectId,
userId,
votedAt: new Date().toISOString(),
quarter: currentQuarter
}

const docRef = await adminDb.collection('votes').add(voteData)

await adminDb
.collection('projects')
.doc(projectId)
.update({
voteCount: adminFirestore.FieldValue.increment(1)
})

return NextResponse.json({
id: docRef.id,
...voteData
}, { status: 201 })
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}

function getCurrentQuarter() {
const now = new Date()
const quarter = Math.floor((now.getMonth() + 3) / 3)
const year = now.getFullYear()
return `Q${quarter}-${year}`
}
