import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Session } from '@supabase/supabase-js'
import { Rocket, Shield, Zap, ChevronRight, Menu } from 'lucide-react'
import ChatWidget from './components/ChatWidget'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
function App() {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!session) {
        return <Auth />
    }

    return (
        <div className="min-h-screen futuristic-grid relative overflow-hidden bg-dark-bg">
            <ChatWidget />
            {/* Background glowing orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between p-6 md:px-12 backdrop-blur-md border-b border-white/10 shadow-sm">
                <div className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
                    NEXUS
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                    <a href="#" className="hover:text-neon-cyan transition-colors">Features</a>
                    <a href="#" className="hover:text-neon-cyan transition-colors">Ecosystem</a>
                    <a href="#" className="hover:text-neon-cyan transition-colors">Roadmap</a>
                </div>
                <div className="hidden md:flex gap-4">
                    <div className="flex items-center text-sm text-gray-400 mr-4">
                        {session.user.email}
                    </div>
                    <button
                        onClick={() => supabase.auth.signOut()}
                        className="px-6 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all font-semibold uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                    >
                        Sign Out
                    </button>
                    <button className="px-6 py-2 rounded-full border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 transition-all font-semibold uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]">
                        Launch App
                    </button>
                </div>
                <button className="md:hidden text-gray-300 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-84px)] px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <div className="inline-block mb-8 px-4 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 backdrop-blur-sm text-xs font-semibold tracking-widest text-[#e0b0ff] uppercase shadow-[0_0_10px_rgba(157,0,255,0.2)]">
                        v2.0 Protocol Live
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight">
                        The Future of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple glow-text">
                            Digital Reality
                        </span>
                    </h1>

                    <p className="max-w-2xl text-gray-400 text-lg md:text-xl mb-12 font-light leading-relaxed">
                        Enter the next generation of decentralized infrastructure. Built for speed, scaled for infinity, and designed for the pioneers of tomorrow.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
                        <button className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-black uppercase tracking-wider overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple" />
                            <div className="absolute inset-0 bg-white/20 hover:bg-transparent transition-colors duration-300" />
                            <span className="relative flex items-center justify-center gap-2">
                                Get Started
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white uppercase tracking-wider border border-white/20 hover:border-neon-cyan/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                            View Documentation
                        </button>
                    </div>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full pb-20">
                    {[
                        { icon: <Zap className="w-8 h-8 text-neon-cyan" />, title: "Quantum Speed", desc: "Execute transactions at the speed of light with our optimized rollup architecture." },
                        { icon: <Shield className="w-8 h-8 text-neon-purple" />, title: "Titanium Security", desc: "Military-grade cryptography keeping your localized assets invulnerable and private." },
                        { icon: <Rocket className="w-8 h-8 text-neon-pink" />, title: "Boundless Scale", desc: "Infinite horizontal scaling that adapts seamlessly to your ecosystem demands." }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 + idx * 0.2 }}
                            className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-neon-cyan/50 hover:bg-white/10 transition-all duration-500 group cursor-pointer text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[100px] -z-10" />
                            <div className="mb-6 p-4 rounded-xl bg-white/5 inline-block group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-white/5 shadow-lg">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-neon-cyan transition-colors">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default App
