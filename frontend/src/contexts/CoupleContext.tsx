import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface PartnerInfo {
  id: string;
  username: string;
  display_name: string;
  role: 'boyfriend' | 'girlfriend';
}

interface CoupleData {
  anniversaryDate: Date | null;
  relationshipStart: Date | null;
  partnerNames: [string, string];
  myName: string;
  partnerName: string;
  partner: PartnerInfo | null;
  isLoading: boolean;
}

const CoupleContext = createContext<CoupleData | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.partner_id) {
      loadPartner();
    } else {
      setIsLoading(false);
    }
  }, [user?.partner_id]);

  const loadPartner = async () => {
    if (!user?.partner_id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, display_name, role')
        .eq('id', user.partner_id)
        .single();

      if (error) throw error;
      if (data) {
        setPartner(data as PartnerInfo);
      }
    } catch (error) {
      console.error('Failed to load partner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get names in order (boyfriend first, girlfriend second)
  const getOrderedNames = (): [string, string] => {
    if (!user || !partner) return ['Partner 1', 'Partner 2'];

    const myName = user.display_name || user.username;
    const partnerName = partner.display_name || partner.username;

    if (user.role === 'boyfriend') {
      return [myName, partnerName];
    } else {
      return [partnerName, myName];
    }
  };

  // Parse date strings to Date objects
  const parseDate = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const myName = user?.display_name || user?.username || 'Me';
  const partnerName = partner?.display_name || partner?.username || 'Partner';

  const value: CoupleData = {
    anniversaryDate: parseDate(user?.anniversary_date || null),
    relationshipStart: parseDate(user?.relationship_start || null),
    partnerNames: getOrderedNames(),
    myName,
    partnerName,
    partner,
    isLoading,
  };

  return (
    <CoupleContext.Provider value={value}>
      {children}
    </CoupleContext.Provider>
  );
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (context === undefined) {
    throw new Error('useCouple must be used within a CoupleProvider');
  }
  return context;
};
