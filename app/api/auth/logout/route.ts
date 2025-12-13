import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
export async function POST() {
try {
const { error } = await supabase.auth.signOut()
if (error) {
return NextResponse.json({ error: error.message }, { status: 400 })
}
return NextResponse.json({ success: true })
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}
