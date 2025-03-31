import { createContext, useContext, useEffect, useState } from "react";

// Тип для користувача
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  availablecl: number;
  role: string;
}

// Контекст авторизації
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  updateUser: (updatedUserData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контексту
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Запит на сервер для отримання інформації про користувача
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Користувач не авторизований");
        
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (updatedUserData: User) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  // Функція виходу
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для використання контексту
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
