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

    return (
        <div className="min-h-screen futuristic-grid relative overflow-hidden bg-dark-bg">
            <Suspense fallback={null}>
                <ChatWidget />
            </Suspense>

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

