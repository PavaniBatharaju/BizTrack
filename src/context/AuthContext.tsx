import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, OnboardingData, BusinessProfile } from '../types';
import { initialBusinessProfile } from '../data/sampleData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    businessName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  confirmPasswordReset: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
  resetSentEmail: string | null;
  setResetSentEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'biztrack_auth_user_v1';
const USERS_STORAGE_KEY = 'biztrack_registered_users_v1';
const REMEMBER_ME_KEY = 'biztrack_remember_me_v1';

// Seed demo users
const defaultSeedUsers: Record<string, { user: User; passwordHash: string; profile?: Partial<BusinessProfile> }> = {
  'demo@biztrack.in': {
    user: {
      id: 'user-demo-1',
      fullName: 'Rahul Sharma',
      email: 'demo@biztrack.in',
      phoneNumber: '+91 98234 56789',
      businessName: 'Sharma Electronics & Smart Tech',
      createdAt: '2026-01-15T09:00:00.000Z',
      onboardingCompleted: true,
    },
    passwordHash: 'Password@123',
    profile: initialBusinessProfile,
  },
  'rahul@biztrack.in': {
    user: {
      id: 'user-demo-2',
      fullName: 'Rahul Sharma',
      email: 'rahul@biztrack.in',
      phoneNumber: '+91 98234 56789',
      businessName: 'Sharma Electronics & Retail',
      createdAt: '2026-02-01T10:00:00.000Z',
      onboardingCompleted: true,
    },
    passwordHash: 'BizTrack@2026',
    profile: initialBusinessProfile,
  },
  'pavanibatharaju@gmail.com': {
    user: {
      id: 'user-demo-3',
      fullName: 'Pavani Batharaju',
      email: 'pavanibatharaju@gmail.com',
      phoneNumber: '+91 98765 43210',
      businessName: 'Pavani Enterprises',
      createdAt: '2026-08-20T10:00:00.000Z',
      onboardingCompleted: true,
    },
    passwordHash: 'BizTrack@2026',
    profile: {
      ...initialBusinessProfile,
      name: 'Pavani Batharaju',
      businessName: 'Pavani Enterprises',
      email: 'pavanibatharaju@gmail.com',
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resetSentEmail, setResetSentEmail] = useState<string | null>(null);

  // Initialize from storage
  useEffect(() => {
    try {
      // Ensure seed users exist in database storage
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultSeedUsers));
      }

      const activeUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (activeUser) {
        const parsed = JSON.parse(activeUser);
        setCurrentUser(parsed);
      }
    } catch (e) {
      console.error('Failed to load auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    // Artificial network delay for realistic experience
    await new Promise((res) => setTimeout(res, 650));

    const cleanEmail = email.trim().toLowerCase();
    const storedUsersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = storedUsersJson ? JSON.parse(storedUsersJson) : defaultSeedUsers;

    const record = usersMap[cleanEmail];

    if (!record) {
      return {
        success: false,
        error: 'Invalid email or password. Please try again.',
      };
    }

    if (record.passwordHash !== password) {
      return {
        success: false,
        error: 'Invalid email or password. Please try again.',
      };
    }

    const user: User = record.user;
    setCurrentUser(user);

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(REMEMBER_ME_KEY, cleanEmail);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    return { success: true };
  };

  const register = async (data: {
    fullName: string;
    businessName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    await new Promise((res) => setTimeout(res, 850));

    const cleanEmail = data.email.trim().toLowerCase();
    const storedUsersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = storedUsersJson ? JSON.parse(storedUsersJson) : { ...defaultSeedUsers };

    if (usersMap[cleanEmail]) {
      return {
        success: false,
        error: 'An account already exists with this email.',
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName.trim(),
      businessName: data.businessName.trim(),
      email: cleanEmail,
      phoneNumber: data.phoneNumber.trim(),
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
    };

    usersMap[cleanEmail] = {
      user: newUser,
      passwordHash: data.password,
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  const logout = async (): Promise<void> => {
    await new Promise((res) => setTimeout(res, 200));
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
  };

  const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 600));
    const cleanEmail = email.trim().toLowerCase();
    setResetSentEmail(cleanEmail);
    // Generic security message (doesn't leak account existence)
    return { success: true };
  };

  const confirmPasswordReset = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 600));

    const targetEmail = resetSentEmail || 'demo@biztrack.in';
    const storedUsersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = storedUsersJson ? JSON.parse(storedUsersJson) : { ...defaultSeedUsers };

    if (usersMap[targetEmail]) {
      usersMap[targetEmail].passwordHash = newPassword;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
    }

    return { success: true };
  };

  const completeOnboarding = async (data: OnboardingData): Promise<void> => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      onboardingCompleted: true,
    };

    const storedUsersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = storedUsersJson ? JSON.parse(storedUsersJson) : { ...defaultSeedUsers };

    if (usersMap[currentUser.email]) {
      usersMap[currentUser.email].user = updatedUser;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

    const storedUsersJson = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsersJson) {
      const usersMap = JSON.parse(storedUsersJson);
      if (usersMap[currentUser.email]) {
        usersMap[currentUser.email].user = updated;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
        sendPasswordResetEmail,
        confirmPasswordReset,
        completeOnboarding,
        updateUserProfile,
        resetSentEmail,
        setResetSentEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
