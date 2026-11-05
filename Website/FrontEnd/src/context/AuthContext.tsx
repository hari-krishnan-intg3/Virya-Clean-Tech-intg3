import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  category: 'residential' | 'commercial';
  state: string;
  token: string;
  createdAt: string;
  registeredForNewYears?: boolean;
}

export interface CalculationRecord {
  id: string;
  createdAt: string;
  category: 'residential' | 'commercial';
  systemType: 'solar-rooftop' | 'solar-paai' | 'ev-charging' | 'sodium-bess' | 'hydrogen-plant' | 'telecom-tower';
  monthlyBill: number;
  monthlyUnitsKwh: number;
  systemSizeKw: number;
  estimatedCost: number;
  subsidyOrTaxShield: number;
  netInvestment: number;
  year1Savings: number;
  lifetime25YrSavings: number;
  paybackYears: number;
  stateDiscom: string;
  boqSummary: string[];
}

export interface QuoteRecord {
  id: string;
  calculationId: string;
  quoteNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  category: 'residential' | 'commercial';
  systemSizeKw: number;
  systemType: string;
  netInvestment: number;
  lifetimeSavings: number;
  paybackPeriod: string;
  terms: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (credential: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    category: 'residential' | 'commercial';
    state?: string;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  savedCalculations: CalculationRecord[];
  savedQuotes: QuoteRecord[];
  saveCalculation: (calc: Omit<CalculationRecord, 'id' | 'createdAt'>) => CalculationRecord;
  saveQuote: (quote: Omit<QuoteRecord, 'id' | 'createdAt' | 'quoteNumber'>) => QuoteRecord;
  hasReceivedEbook: boolean;
  markEbookReceived: () => void;
}

const STORAGE_KEY_USER = 'virya_auth_user';
const STORAGE_KEY_CALCS = 'virya_user_calculations';
const STORAGE_KEY_QUOTES = 'virya_user_quotes';
const STORAGE_KEY_EBOOK = 'virya_ebook_received';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [savedCalculations, setSavedCalculations] = useState<CalculationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CALCS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedQuotes, setSavedQuotes] = useState<QuoteRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_QUOTES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [hasReceivedEbook, setHasReceivedEbook] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_EBOOK) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('auth=demo') && !user) {
      setUser({
        id: 'usr_demo_2026',
        fullName: 'Ramesh Kumar (Residential)',
        email: 'ramesh.kumar@cleanliving.in',
        phone: '+91 98860 12345',
        category: 'residential',
        state: 'Karnataka - BESCOM',
        token: 'jwt_demo_token',
        createdAt: new Date().toISOString(),
        registeredForNewYears: true,
      });
    }
  }, [user]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to sync user storage', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CALCS, JSON.stringify(savedCalculations));
    } catch (e) {
      console.error('Failed to sync calcs storage', e);
    }
  }, [savedCalculations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(savedQuotes));
    } catch (e) {
      console.error('Failed to sync quotes storage', e);
    }
  }, [savedQuotes]);

  const login = async (credential: string, _password?: string) => {
    const credClean = credential.trim();
    if (!credClean) {
      return { success: false, error: 'Please enter your User ID, Email, or Mobile Number.' };
    }

    // Determine if email or phone or username
    const isEmail = credClean.includes('@');
    const isPhone = /^[0-9+\s-]{8,15}$/.test(credClean);

    const loggedUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: isEmail ? credClean.split('@')[0] : isPhone ? `User ${credClean.slice(-4)}` : credClean,
      email: isEmail ? credClean : `${credClean.toLowerCase().replace(/[^a-z0-9]/g, '')}@viryacleantech.client`,
      phone: isPhone ? credClean : '+91 98860 12345',
      category: 'residential',
      state: 'Karnataka - BESCOM',
      token: `jwt_${Math.random().toString(36).substring(2)}`,
      createdAt: new Date().toISOString(),
      registeredForNewYears: true,
    };

    setUser(loggedUser);
    return { success: true };
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    category: 'residential' | 'commercial';
    state?: string;
    password?: string;
  }) => {
    if (!data.fullName.trim()) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!data.email.trim() || !data.email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }
    if (!data.phone.trim()) {
      return { success: false, error: 'Mobile phone number is required.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      category: data.category,
      state: data.state || 'Karnataka - BESCOM',
      token: `jwt_${Math.random().toString(36).substring(2)}`,
      createdAt: new Date().toISOString(),
      registeredForNewYears: true,
    };

    setUser(newUser);

    // Auto-capture lead to backend API
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          company: newUser.category === 'commercial' ? `${newUser.fullName} Enterprises` : 'Residential Consumer',
          service: 'solar',
          location: newUser.state,
          details: `Registered for New User CleanTech Energy Platform (${newUser.category}). Auto-qualified for PM Surya Ghar / Commercial AD.`,
          source: 'new-user-registration',
          newsletterConsent: true,
        }),
      }).catch(() => {
        // Tolerant of offline/preview environments
      });
    } catch {
      // ignore network errors
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const saveCalculation = (calc: Omit<CalculationRecord, 'id' | 'createdAt'>): CalculationRecord => {
    const record: CalculationRecord = {
      ...calc,
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setSavedCalculations((prev) => [record, ...prev]);
    return record;
  };

  const saveQuote = (quote: Omit<QuoteRecord, 'id' | 'createdAt' | 'quoteNumber'>): QuoteRecord => {
    const quoteNum = `VCT-PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: QuoteRecord = {
      ...quote,
      id: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      quoteNumber: quoteNum,
      createdAt: new Date().toISOString(),
    };
    setSavedQuotes((prev) => [record, ...prev]);

    // Send lead update with quote details
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: quote.customerName,
          email: quote.customerEmail,
          phone: quote.customerPhone,
          company: quote.category === 'commercial' ? 'Commercial Client' : 'Residential Homeowner',
          service: 'solar',
          capacity: `${quote.systemSizeKw} kW (${quote.systemType})`,
          details: `Generated proposal ${quoteNum}. Net Investment: ₹${quote.netInvestment.toLocaleString('en-IN')}, 25-Yr Savings: ₹${quote.lifetimeSavings.toLocaleString('en-IN')}, Payback: ${quote.paybackPeriod}`,
          source: 'roi-quote-generator',
          newsletterConsent: true,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    return record;
  };

  const markEbookReceived = () => {
    setHasReceivedEbook(true);
    try {
      localStorage.setItem(STORAGE_KEY_EBOOK, 'true');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        savedCalculations,
        savedQuotes,
        saveCalculation,
        saveQuote,
        hasReceivedEbook,
        markEbookReceived,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

