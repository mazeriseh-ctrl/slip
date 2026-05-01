import { useState, useEffect, Suspense, lazy } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './shared/lib/supabase'

// Lazy loaded components for code splitting
const Auth = lazy(() => import('./features/auth'))
const LandingPage = lazy(() => import('./features/landing'))
const ChatWidget = lazy(() => import('./features/chat'))

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

    // Simple loading spinner for suspense fallback
    const LoadingSpinner = () => (
        <div className="flex h-screen w-full items-center justify-center bg-dark-bg">
            <div className="w-12 h-12 rounded-full border-4 border-neon-cyan border-t-transparent animate-spin"></div>
        </div>
    )

    if (!session) {
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <Auth />
            </Suspense>
        )
    }

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        document.documentElement.style.setProperty('--color-dark-bg', color);
        document.body.style.backgroundColor = color;
    };

    return (
        <div className="min-h-screen futuristic-grid relative overflow-hidden bg-dark-bg" style={{ transition: 'background-color 0.3s ease' }}>
            <Suspense fallback={null}>
                <ChatWidget />
            </Suspense>

            {/* Theme Color Picker */}
            <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-black/40 p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 shadow-lg hover:border-white/30 transition-all group">
                <input
                    type="color"
                    id="theme-color"
                    onChange={handleThemeChange}
                    defaultValue="#050510"
                    className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-0 p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full"
                    title="Change Background Theme"
                />
                <label htmlFor="theme-color" className="text-sm text-white/70 cursor-pointer font-medium group-hover:text-white transition-colors">
                    Theme Color
                </label>
            </div>

            {/* Background glowing orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none" />

            <Suspense fallback={<LoadingSpinner />}>
                <LandingPage session={session} />
            </Suspense>
        </div>
    )
}

export default App

