import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
export async function POST(request: Request) {
try {
const { email, password, firstName, lastName } = await request.json()
const { data: authData, error: authError } = await supabase.auth.signUp({
email,
password,
options: {
data: {
first_name: firstName,
last_name: lastName,
}
}
})
if (authError) {
return NextResponse.json({ error: authError.message }, { status: 400 })
}
if (authData.user) {
const { error: profileError } = await supabase
.from('users')
.insert({
id: authData.user.id,
email: authData.user.email,
first_name: firstName,
last_name: lastName,
})
if (profileError) {
console.error('Profile creation error:', profileError)
}
}
return NextResponse.json({
success: true,
message: 'Registration successful! Please check your email to confirm.',
user: authData.user
})
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 })
}
}
