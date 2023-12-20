import {User,getAuth, onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext,useEffect, useState } from 'react'

export const AuthContext = createContext<User | undefined>(undefined);
export function useAuth() {
    return useContext(AuthContext);
}

export function Auth ({children}) {
    const [currentUser, setCurrentUser] = useState<User>()

    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                setCurrentUser(user);
            }
        })
    }, [])

    return (
        <AuthContext.Provider  value={currentUser}>
            {children}
        </AuthContext.Provider>
    );
}