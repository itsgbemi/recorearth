import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
export async function POST(request: Request) {
try {
const body = await request.json()
const { data, error } = await supabase
.from('votes')
.insert([body])
.select()
.single()
if (error) {
throw error
}
return NextResponse.json(data, { status: 201 })
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}
export async function GET(request: Request) {
try {
const { searchParams } = new URL(request.url)
const projectId = searchParams.get('projectId')
let query = supabase.from('votes').select('*')
if (projectId) {
query = query.eq('project_id', projectId)
}
const { data, error } = await query
if (error) {
throw error
}
return NextResponse.json(data)
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}
