import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebase-admin'

export async function GET(request: NextRequest) {
try {
const searchParams = request.nextUrl.searchParams
const category = searchParams.get('category')
const limit = searchParams.get('limit') || '50'

let query = adminDb.collection('courses').orderBy('createdAt', 'desc')

if (category && category !== 'all') {
query = query.where('category', '==', category)
}

if (limit) {
query = query.limit(parseInt(limit))
}

const snapshot = await query.get()
const courses = snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}))

return NextResponse.json(courses)
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}

export async function POST(request: NextRequest) {
try {
const body = await request.json()
const courseData = {
...body,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
}

const docRef = await adminDb.collection('courses').add(courseData)

return NextResponse.json({
id: docRef.id,
...courseData
}, { status: 201 })
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}
