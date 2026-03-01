import { useState } from 'react'
import { supabase } from '../../../shared/lib/supabase'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                alert('เข้าสู่ระบบสำเร็จ!')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                alert('สมัครสมาชิกสำเร็จ! กรุณาเช็คอีเมลเพื่อยืนยันตัวตน (ถ้าตั้งค่าเปิด Confirm ไว้)')
            }
        } catch (error: any) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex bg-gray-900 justify-center items-center min-h-screen p-4">
            <div className="bg-gray-800 shadow-xl p-8 rounded-2xl w-full max-w-md">
                <h2 className="mb-6 font-bold text-2xl text-center text-white">
                    {isLogin ? 'เข้าสู่ระบบแชท' : 'สมัครสมาชิกใหม่'}
                </h2>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-gray-400 text-sm">อีเมล</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-700 w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-400 text-sm">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-700 w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="hover:bg-blue-700 bg-blue-600 w-full px-4 py-3 rounded-lg font-medium text-white transition disabled:opacity-50"
                    >
                        {loading ? 'กำลังโหลด...' : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-400 text-sm">
                    {isLogin ? "ยังไม่มีบัญชีใช่ไหม? " : "มีบัญชีอยู่แล้วใช่ไหม? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="hover:text-blue-300 text-blue-400 hover:underline"
                    >
                        {isLogin ? "สมัครสมาชิกที่นี่" : "เข้าสู่ระบบที่นี่"}
                    </button>
                </div>
            </div>
        </div>
    )
}
