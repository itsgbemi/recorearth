import { supabase } from '../../../../lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
try {
const { data, error } = await supabase
.from('courses')
.select('*')
.order('created_at', { ascending: false })
if (error) {
throw error
}
return NextResponse.json(data)
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}
