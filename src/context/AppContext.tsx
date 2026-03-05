import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, EscrowCase, CaseStatus, CaseDocument, DocumentStatus, TimelineEvent } from '@/types/case';

const MOCK_USERS: User[] = [
  { id: 'buyer-1', role: 'BUYER', name: 'Carlos Rodríguez', company: 'Importadora del Norte S.A. de C.V.', email: 'carlos@importadoradelnorte.com', password: 'demo123' },
  { id: 'seller-1', role: 'SELLER', name: 'Wei Zhang', company: 'Shenzhen Electronics Co. Ltd.', email: 'wei@shenzhenelectronics.com', password: 'demo123' },
  { id: 'ops-1', role: 'OPS', name: 'Ana Martínez', company: 'Axioma Finance', email: 'ana@axioma-finance.com', password: 'demo123' },
];

const DEFAULT_CASES: EscrowCase[] = [
  {
    id: 'AX-2024-001', status: 'IN_ESCROW',
    buyer: 'Importadora del Norte S.A. de C.V.', seller: 'Shenzhen Electronics Co. Ltd.',
    sellerCountry: 'China', sellerEmail: 'wei@shenzhenelectronics.com',
    montoMxn: 875000, montoUsd: 50000, tipoCambio: 17.50, comisionMxn: 8750, totalTransferidoMxn: 883750,
    incoterm: 'FOB', deliveryPoint: 'Puerto de Shanghái', deliveryDeadline: '2024-03-15',
    description: 'Componentes electrónicos — 500 unidades PCB modelo X200', createdAt: '2024-01-10',
    buyerSigned: true, sellerSigned: true,
    documents: [
      { id: 'd1', name: 'Factura_comercial.pdf', type: 'Factura comercial', status: 'VALIDATED', uploadedAt: '2024-02-01' },
      { id: 'd2', name: 'BL_Shanghai.pdf', type: 'Bill of Lading', status: 'VALIDATED', uploadedAt: '2024-02-01' },
      { id: 'd3', name: 'Packing_list.pdf', type: 'Packing list', status: 'PENDING', uploadedAt: '2024-02-02' },
      { id: 'd4', name: 'Confirmacion_embarque.pdf', type: 'Confirmación de embarque', status: 'PENDING', uploadedAt: null },
    ],
    timeline: [
      { date: '2024-01-10 09:00', event: 'Caso creado', icon: '🟦' },
      { date: '2024-01-10 10:30', event: 'Contrato firmado por comprador', icon: '📝' },
      { date: '2024-01-11 14:20', event: 'Contrato firmado por vendedor', icon: '📝' },
      { date: '2024-01-12 11:00', event: 'Transferencia SPEI confirmada — $883,750 MXN', icon: '💰' },
      { date: '2024-01-12 11:05', event: 'Garantía activada — Vendedor recibirá $50,000 USD', icon: '🔒' },
      { date: '2024-02-01 16:40', event: 'Documentos subidos por vendedor', icon: '📄' },
    ],
  },
  {
    id: 'AX-2024-002', status: 'AWAITING_FUNDING',
    buyer: 'Importadora del Norte S.A. de C.V.', seller: 'Textiles Medellín S.A.S.',
    sellerCountry: 'Colombia', sellerEmail: 'ventas@textilesmed.com',
    montoMxn: 350000, montoUsd: 20000, tipoCambio: 17.50, comisionMxn: 3500, totalTransferidoMxn: 353500,
    incoterm: 'DAP', deliveryPoint: 'Bodega Central, CDMX', deliveryDeadline: '2024-04-01',
    description: 'Telas de algodón orgánico — 2,000 metros', createdAt: '2024-01-20',
    buyerSigned: true, sellerSigned: true,
    documents: [],
    timeline: [
      { date: '2024-01-20 10:00', event: 'Caso creado', icon: '🟦' },
      { date: '2024-01-20 11:00', event: 'Contrato firmado por comprador', icon: '📝' },
      { date: '2024-01-21 09:00', event: 'Contrato firmado por vendedor', icon: '📝' },
    ],
  },
  {
    id: 'AX-2024-003', status: 'RELEASED',
    buyer: 'Importadora del Norte S.A. de C.V.', seller: 'García Exportaciones SL',
    sellerCountry: 'España', sellerEmail: 'garcia@garciaexportaciones.es',
    montoMxn: 525000, montoUsd: 30000, tipoCambio: 17.50, comisionMxn: 5250, totalTransferidoMxn: 530250,
    incoterm: 'DAP', deliveryPoint: 'Monterrey, Nuevo León', deliveryDeadline: '2024-01-30',
    description: 'Maquinaria industrial — 3 prensas hidráulicas', createdAt: '2023-12-15',
    buyerSigned: true, sellerSigned: true,
    documents: [],
    timeline: [
      { date: '2023-12-15', event: 'Caso creado', icon: '🟦' },
      { date: '2023-12-16', event: 'Contrato firmado por ambas partes', icon: '📝' },
      { date: '2023-12-17', event: 'Garantía activada — $30,000 USD asegurados', icon: '🔒' },
      { date: '2024-01-28', event: 'Documentos de entrega validados por Axioma', icon: '✅' },
      { date: '2024-01-29', event: 'Pago liberado — $30,000 USD enviados a España', icon: '✓' },
    ],
  },
];

interface AppState {
  currentUser: User | null;
  cases: EscrowCase[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  createCase: (c: EscrowCase) => void;
  updateCaseStatus: (caseId: string, status: CaseStatus) => void;
  uploadDocument: (caseId: string, docType: string, fileName: string) => void;
  validateDocument: (caseId: string, docId: string, approved: boolean) => void;
  addTimelineEvent: (caseId: string, event: TimelineEvent) => void;
  signContract: (caseId: string, party: 'buyer' | 'seller') => void;
  getMockUsers: () => User[];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('axioma_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cases, setCases] = useState<EscrowCase[]>(() => {
    const saved = localStorage.getItem('axioma_cases');
    return saved ? JSON.parse(saved) : DEFAULT_CASES;
  });

  useEffect(() => {
    localStorage.setItem('axioma_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('axioma_user', JSON.stringify(currentUser));
    else localStorage.removeItem('axioma_user');
  }, [currentUser]);

  const login = useCallback((email: string, password: string): boolean => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) { setCurrentUser(user); return true; }
    return false;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const createCase = useCallback((c: EscrowCase) => {
    setCases(prev => [c, ...prev]);
  }, []);

  const updateCaseStatus = useCallback((caseId: string, status: CaseStatus) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status } : c));
  }, []);

  const uploadDocument = useCallback((caseId: string, docType: string, fileName: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const existingIdx = c.documents.findIndex(d => d.type === docType);
      const doc: CaseDocument = {
        id: `doc-${Date.now()}`, name: fileName, type: docType,
        status: 'UPLOADED', uploadedAt: new Date().toISOString(),
      };
      const newDocs = existingIdx >= 0
        ? c.documents.map((d, i) => i === existingIdx ? doc : d)
        : [...c.documents, doc];
      return { ...c, documents: newDocs };
    }));
  }, []);

  const validateDocument = useCallback((caseId: string, docId: string, approved: boolean) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        documents: c.documents.map(d =>
          d.id === docId ? { ...d, status: (approved ? 'VALIDATED' : 'REJECTED') as DocumentStatus } : d
        ),
      };
    }));
  }, []);

  const addTimelineEvent = useCallback((caseId: string, event: TimelineEvent) => {
    setCases(prev => prev.map(c =>
      c.id === caseId ? { ...c, timeline: [...c.timeline, event] } : c
    ));
  }, []);

  const signContract = useCallback((caseId: string, party: 'buyer' | 'seller') => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return party === 'buyer' ? { ...c, buyerSigned: true } : { ...c, sellerSigned: true };
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, cases, login, logout, createCase, updateCaseStatus,
      uploadDocument, validateDocument, addTimelineEvent, signContract,
      getMockUsers: () => MOCK_USERS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
