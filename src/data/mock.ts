import { EscrowCase, CaseEvent, CaseDocument, XrplTransaction, PspEntry, User } from '@/types/case';

export const mockUser: User = {
  id: 'usr_001',
  name: 'Carlos Mendoza',
  email: 'carlos@techpymes.mx',
  role: 'buyer',
  company: 'TechPyMEs S.A. de C.V.',
};

export const mockOpsUser: User = {
  id: 'usr_ops_001',
  name: 'Ana Gutiérrez',
  email: 'ana@axioma.finance',
  role: 'ops',
  company: 'Axioma Finance',
};

export const mockCases: EscrowCase[] = [
  {
    id: 'ESC-2025-001',
    title: 'Compra de componentes electrónicos',
    description: 'Adquisición de 500 unidades de microcontroladores STM32 para línea de producción Q1 2025.',
    status: 'IN_ESCROW',
    amountUSD: 45000,
    amountMXN: 774000,
    buyer: { name: 'Carlos Mendoza', email: 'carlos@techpymes.mx', company: 'TechPyMEs S.A. de C.V.' },
    seller: { name: 'Roberto García', email: 'roberto@electronica-mx.com', company: 'Electrónica MX S.A.' },
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-02-10T14:20:00Z',
    dueDate: '2025-03-15T00:00:00Z',
    disputeWindow: 7,
    settlementType: 'SPEI',
  },
  {
    id: 'ESC-2025-002',
    title: 'Materiales de empaque sustentable',
    description: 'Compra de materiales biodegradables para empaque de productos alimenticios.',
    status: 'AWAITING_ACCEPTANCE',
    amountUSD: 12500,
    amountMXN: 215000,
    buyer: { name: 'Carlos Mendoza', email: 'carlos@techpymes.mx', company: 'TechPyMEs S.A. de C.V.' },
    seller: { name: 'María López', email: 'maria@ecoempaques.mx', company: 'EcoEmpaques México' },
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z',
    dueDate: '2025-04-01T00:00:00Z',
    disputeWindow: 5,
    settlementType: 'SPEI',
  },
  {
    id: 'ESC-2025-003',
    title: 'Licencias de software ERP',
    description: 'Licenciamiento anual de software ERP para gestión de inventarios y contabilidad.',
    status: 'DISPUTE_OPEN',
    amountUSD: 28000,
    amountMXN: 481600,
    buyer: { name: 'Carlos Mendoza', email: 'carlos@techpymes.mx', company: 'TechPyMEs S.A. de C.V.' },
    seller: { name: 'Jorge Ramírez', email: 'jorge@softwaremx.com', company: 'SoftwareMX Solutions' },
    createdAt: '2024-12-10T11:00:00Z',
    updatedAt: '2025-02-05T16:45:00Z',
    dueDate: '2025-02-28T00:00:00Z',
    disputeWindow: 10,
    settlementType: 'ON_CHAIN',
  },
  {
    id: 'ESC-2025-004',
    title: 'Maquinaria industrial CNC',
    description: 'Compra de torno CNC de 5 ejes para taller de manufactura avanzada.',
    status: 'READY_TO_RELEASE',
    amountUSD: 120000,
    amountMXN: 2064000,
    buyer: { name: 'Carlos Mendoza', email: 'carlos@techpymes.mx', company: 'TechPyMEs S.A. de C.V.' },
    seller: { name: 'Hiroshi Tanaka', email: 'sales@precision-cnc.jp', company: 'Precision CNC Japan' },
    createdAt: '2024-11-20T08:00:00Z',
    updatedAt: '2025-02-20T12:00:00Z',
    dueDate: '2025-03-01T00:00:00Z',
    disputeWindow: 14,
    settlementType: 'SPEI',
  },
  {
    id: 'ESC-2025-005',
    title: 'Servicios de consultoría fiscal',
    description: 'Consultoría fiscal y planeación tributaria para ejercicio 2025.',
    status: 'RELEASED',
    amountUSD: 8500,
    amountMXN: 146200,
    buyer: { name: 'Carlos Mendoza', email: 'carlos@techpymes.mx', company: 'TechPyMEs S.A. de C.V.' },
    seller: { name: 'Patricia Vega', email: 'patricia@fiscalmx.com', company: 'FiscalMX Consultores' },
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2025-01-31T18:00:00Z',
    dueDate: '2025-01-31T00:00:00Z',
    disputeWindow: 7,
    settlementType: 'SPEI',
  },
  {
    id: 'ESC-2025-006',
    title: 'Suministro de acero inoxidable',
    description: 'Láminas de acero inoxidable 304 para fabricación de tanques industriales.',
    status: 'AWAITING_FUNDING_USDC',
    amountUSD: 67000,
    amountMXN: 1152400,
    buyer: { name: 'Carlos Mendoza', email: 'carlos@techpymes.mx', company: 'TechPyMEs S.A. de C.V.' },
    seller: { name: 'Fernando Díaz', email: 'fernando@aceromx.com', company: 'AceroMX Industrial' },
    createdAt: '2025-02-18T14:00:00Z',
    updatedAt: '2025-02-19T09:30:00Z',
    dueDate: '2025-04-18T00:00:00Z',
    disputeWindow: 7,
    settlementType: 'ON_CHAIN',
  },
];

export const mockEvents: CaseEvent[] = [
  { id: 'evt_001', caseId: 'ESC-2025-001', type: 'CREATED', description: 'Caso de escrow creado', actor: 'Carlos Mendoza', timestamp: '2025-01-15T10:30:00Z' },
  { id: 'evt_002', caseId: 'ESC-2025-001', type: 'ACCEPTED', description: 'Términos aceptados por el vendedor', actor: 'Roberto García', timestamp: '2025-01-16T14:00:00Z' },
  { id: 'evt_003', caseId: 'ESC-2025-001', type: 'FUNDED', description: 'Fondeo USDC confirmado — $45,000.00 USD', actor: 'Sistema', timestamp: '2025-01-20T11:30:00Z' },
  { id: 'evt_004', caseId: 'ESC-2025-001', type: 'ESCROW_CREATED', description: 'Escrow creado en XRPL — tx confirmada', actor: 'Sistema', timestamp: '2025-01-20T11:35:00Z' },
  { id: 'evt_005', caseId: 'ESC-2025-001', type: 'DOCUMENT_UPLOADED', description: 'Factura comercial subida', actor: 'Roberto García', timestamp: '2025-02-01T09:00:00Z' },
  { id: 'evt_006', caseId: 'ESC-2025-001', type: 'DOCUMENT_UPLOADED', description: 'Guía de embarque subida', actor: 'Roberto García', timestamp: '2025-02-10T14:20:00Z' },
];

export const mockDocuments: CaseDocument[] = [
  { id: 'doc_001', name: 'factura_comercial_001.pdf', type: 'application/pdf', size: 245000, hash: 'a3f2b8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', uploadedAt: '2025-02-01T09:00:00Z', uploadedBy: 'Roberto García' },
  { id: 'doc_002', name: 'guia_embarque_DHL.pdf', type: 'application/pdf', size: 180000, hash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', uploadedAt: '2025-02-10T14:20:00Z', uploadedBy: 'Roberto García' },
  { id: 'doc_003', name: 'contrato_suministro.docx', type: 'application/docx', size: 320000, hash: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', uploadedAt: '2025-01-15T10:35:00Z', uploadedBy: 'Carlos Mendoza' },
];

export const mockXrplTxs: XrplTransaction[] = [
  { hash: 'A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2', type: 'EscrowCreate', status: 'SUCCESS', amount: '45000', date: '2025-01-20T11:35:00Z' },
];

export const mockPspEntries: PspEntry[] = [
  { id: 'psp_001', type: 'HOLD', amountUSD: 45000, status: 'COMPLETED', reference: 'HOLD-2025-001-USDC', date: '2025-01-20T11:30:00Z' },
];

export function formatDateMX(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatCurrency(amount: number, currency: 'USD' | 'MXN'): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount);
}
