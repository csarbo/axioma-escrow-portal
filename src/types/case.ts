export type CaseStatus =
  | 'DRAFT'
  | 'AWAITING_ACCEPTANCE'
  | 'AWAITING_FUNDING'
  | 'IN_ESCROW'
  | 'DISPUTE_OPEN'
  | 'ARBITRATION_PENDING'
  | 'READY_TO_RELEASE'
  | 'RELEASED'
  | 'CANCELLED'
  | 'EXCEPTION';

export type UserRole = 'BUYER' | 'SELLER' | 'OPS';

export type DocumentStatus = 'PENDING' | 'UPLOADED' | 'VALIDATED' | 'REJECTED';

export type Incoterm = 'FOB' | 'DAP';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  company: string;
  email: string;
  password: string;
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploadedAt: string | null;
  file?: string; // simulated filename
}

export interface TimelineEvent {
  date: string;
  event: string;
  icon: string;
}

export interface EscrowCase {
  id: string;
  status: CaseStatus;
  buyer: string;
  seller: string;
  sellerCountry: string;
  sellerEmail: string;
  montoMxn: number;
  montoUsd: number;
  tipoCambio: number;
  comisionMxn: number;
  totalTransferidoMxn: number;
  incoterm: Incoterm;
  deliveryPoint: string;
  deliveryDeadline: string;
  description: string;
  createdAt: string;
  documents: CaseDocument[];
  timeline: TimelineEvent[];
  // Seller bank info (optional, filled during creation)
  sellerBankCountry?: string;
  sellerRfc?: string;
  sellerBankInfo?: Record<string, string>;
  // Contract
  buyerSigned?: boolean;
  sellerSigned?: boolean;
}

export const STATUS_CONFIG: Record<CaseStatus, { label: string; colorClass: string }> = {
  DRAFT: { label: 'Borrador', colorClass: 'bg-status-draft' },
  AWAITING_ACCEPTANCE: { label: 'Pendiente de firma', colorClass: 'bg-status-awaiting' },
  AWAITING_FUNDING: { label: 'Esperando transferencia', colorClass: 'bg-status-funding' },
  IN_ESCROW: { label: 'Garantía activa 🔒', colorClass: 'bg-status-escrow' },
  DISPUTE_OPEN: { label: 'En revisión', colorClass: 'bg-status-dispute' },
  ARBITRATION_PENDING: { label: 'En arbitraje', colorClass: 'bg-status-arbitration' },
  READY_TO_RELEASE: { label: 'Listo para liberar ✅', colorClass: 'bg-status-ready' },
  RELEASED: { label: 'Completado ✓', colorClass: 'bg-status-released' },
  CANCELLED: { label: 'Cancelado', colorClass: 'bg-status-cancelled' },
  EXCEPTION: { label: 'En revisión por Axioma ⚠️', colorClass: 'bg-status-exception' },
};

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDateMX(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getRequiredDocs(incoterm: Incoterm): { name: string; type: string }[] {
  if (incoterm === 'FOB') {
    return [
      { name: 'Factura comercial', type: 'Factura comercial' },
      { name: 'Bill of Lading', type: 'Bill of Lading' },
      { name: 'Packing list', type: 'Packing list' },
      { name: 'Confirmación de embarque', type: 'Confirmación de embarque' },
    ];
  }
  return [
    { name: 'Factura comercial', type: 'Factura comercial' },
    { name: 'Carta porte', type: 'Carta porte' },
    { name: 'Packing list', type: 'Packing list' },
    { name: 'Foto de entrega en destino', type: 'Foto de entrega' },
  ];
}
