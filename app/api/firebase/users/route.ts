import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebase-admin'

export async function GET(request: NextRequest) {
try {
const searchParams = request.nextUrl.searchParams
const userId = searchParams.get('userId')

if (!userId) {
return NextResponse.json(
{ error: 'User ID is required' },
{ status: 400 }
)
}

const userDoc = await adminDb.collection('users').doc(userId).get()

if (!userDoc.exists) {
return NextResponse.json({ error: 'User not found' }, { status: 404 })
}

return NextResponse.json({
id: userDoc.id,
...userDoc.data()
})
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}

export async function PUT(request: NextRequest) {
try {
const body = await request.json()
const { userId, ...updates } = body

if (!userId) {
return NextResponse.json(
{ error: 'User ID is required' },
{ status: 400 }
)
}

await adminDb
.collection('users')
.doc(userId)
.update({
...updates,
updatedAt: new Date().toISOString()
})

return NextResponse.json({ success: true })
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}
