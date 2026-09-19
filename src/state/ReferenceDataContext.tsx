import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, Hotel, Sector, StaffUser } from '../types';
import { subscribeHotels } from '../services/hotels';
import { subscribeSectors } from '../services/sectors';
import { subscribeCategories } from '../services/categories';
import { subscribeStaff } from '../services/staff';
import { useAuth } from './AuthContext';

interface ReferenceDataValue {
  hotels: Hotel[];
  sectors: Sector[];
  categories: Category[];
  staff: StaffUser[];
  loading: boolean;
  hotelName: (id: string | null) => string;
  categoryName: (id: string | null) => string;
  staffName: (id: string | null) => string;
  staffById: (id: string | null) => StaffUser | null;
}

const ReferenceDataContext = createContext<ReferenceDataValue | null>(null);

export function ReferenceDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loaded, setLoaded] = useState({ hotels: false, sectors: false, categories: false, staff: false });

  useEffect(() => {
    if (!user) {
      setHotels([]);
      setSectors([]);
      setCategories([]);
      setStaff([]);
      return;
    }
    const unsubs = [
      subscribeHotels((v) => {
        setHotels(v);
        setLoaded((s) => ({ ...s, hotels: true }));
      }),
      subscribeSectors((v) => {
        setSectors(v);
        setLoaded((s) => ({ ...s, sectors: true }));
      }),
      subscribeCategories((v) => {
        setCategories(v);
        setLoaded((s) => ({ ...s, categories: true }));
      }),
      subscribeStaff((v) => {
        setStaff(v);
        setLoaded((s) => ({ ...s, staff: true }));
      }),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [user]);

  const hotelName = (id: string | null) => hotels.find((h) => h.id === id)?.name || '—';
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name || '—';
  const staffById = (id: string | null) => (id ? staff.find((s) => s.id === id) || null : null);
  const staffName = (id: string | null) => (id ? staffById(id)?.name || '—' : 'Não atribuído');

  return (
    <ReferenceDataContext.Provider
      value={{
        hotels,
        sectors,
        categories,
        staff,
        loading: !(loaded.hotels && loaded.sectors && loaded.categories && loaded.staff),
        hotelName,
        categoryName,
        staffName,
        staffById,
      }}
    >
      {children}
    </ReferenceDataContext.Provider>
  );
}

export function useReferenceData(): ReferenceDataValue {
  const ctx = useContext(ReferenceDataContext);
  if (!ctx) throw new Error('useReferenceData must be used within ReferenceDataProvider');
  return ctx;
}
