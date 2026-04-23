import { Session } from "next-auth";
import {create} from "zustand";

type SessionStatus = "authenticated" | "loading" | "unauthenticated"

interface AuthState {
  isAuth: boolean
  session: Session | null
  status: SessionStatus
  setAuthState: (status: SessionStatus, session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuth: false,
    status: 'loading',
    session: null,
    setAuthState: (status: SessionStatus, session: Session | null) => set({
        isAuth: status === 'authenticated',
        status,
        session
    })
}))