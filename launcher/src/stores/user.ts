import { create } from "zustand";

interface User {
  discordId: string;
  email: string;
  username: string;
  password: any;
  vbucks: number;
  favorite_character: string;
  role: string;
  accountId: string;
  token: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (userData) => {
    set({ user: userData });
    localStorage.setItem("authUser", JSON.stringify(userData));
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem("authUser");
  },
}));

const storedUser = localStorage.getItem("authUser");
if (storedUser) {
  useAuth.setState({ user: JSON.parse(storedUser) });
}
