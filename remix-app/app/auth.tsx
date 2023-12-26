import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null as User | null);
export function useAuth() {
	return useContext(AuthContext);
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
			setUser(user);
		});
		return unsubscribe;
	}, []);
	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
