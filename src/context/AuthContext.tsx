
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userDate: any) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean; // AJOUTE CECI
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Données mockées pour la démo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'admin@cabinet.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    nom: 'Martin',
    prenom: 'Dr. Sophie',
    email: 'dr.martin@cabinet.com',
    password: 'medecin123',
    role: 'medecin',
    specialite: 'Cardiologie'
  },
  {
    id: '3',
    nom: 'Durand',
    prenom: 'Pierre',
    email: 'pierre.durand@email.com',
    password: 'patient123',
    role: 'patient',
    age: 35,
    contact: '0123456789'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsInitialized(true);
  }, []);

    // Nouvelle signature
    const login = async (userData: any): Promise<boolean> => {
        try {
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            return true;
        } catch {
            return false;
        }
    };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const newUser = {
      ...userData,
      id: Date.now().toString()
    };
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isInitialized
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
