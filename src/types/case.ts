export type CaseStatus =
  | 'DRAFT'
  | 'AWAITING_ACCEPTANCE'
  | 'AWAITING_FUNDING_USDC'
  | 'AWAITING_ESCROW_FUNDING_XRP'
  | 'IN_ESCROW'
  | 'DISPUTE_OPEN'
  | 'ARBITRATION_PENDING'
  | 'READY_TO_RELEASE'
  | 'RELEASED'
  | 'CANCELLED'
  | 'EXCEPTION';

export type UserRole = 'buyer' | 'seller' | 'ops' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
}

export interface EscrowCase {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  amountUSD: number;
  amountMXN: number;
  buyer: { name: string; email: string; company: string };
  seller: { name: string; email: string; company: string };
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  disputeWindow: number; // days
  settlementType: 'SPEI' | 'ON_CHAIN';
}

export interface CaseEvent {
  id: string;
  caseId: string;
  type: 'CREATED' | 'ACCEPTED' | 'FUNDED' | 'ESCROW_CREATED' | 'DISPUTE_OPENED' | 'ARBITRATION_STARTED' | 'RELEASED' | 'REFUNDED' | 'CANCELLED' | 'DOCUMENT_UPLOADED';
  description: string;
  actor: string;
  timestamp: string;
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface XrplTransaction {
  hash: string;
  type: 'EscrowCreate' | 'EscrowFinish' | 'EscrowCancel';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  amount: string;
  date: string;
}

export interface PspEntry {
  id: string;
  type: 'HOLD' | 'RELEASE' | 'REFUND';
  amountUSD: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  reference: string;
  date: string;
}

export const STATUS_CONFIG: Record<CaseStatus, { label: string; colorClass: string }> = {
  DRAFT: { label: 'Borrador', colorClass: 'bg-status-draft' },
  AWAITING_ACCEPTANCE: { label: 'Esperando aceptación', colorClass: 'bg-status-awaiting' },
  AWAITING_FUNDING_USDC: { label: 'Esperando fondeo USDC', colorClass: 'bg-status-funding' },
  AWAITING_ESCROW_FUNDING_XRP: { label: 'Esperando escrow XRP', colorClass: 'bg-status-funding' },
  IN_ESCROW: { label: 'En escrow', colorClass: 'bg-status-escrow' },
  DISPUTE_OPEN: { label: 'Disputa abierta', colorClass: 'bg-status-dispute' },
  ARBITRATION_PENDING: { label: 'Arbitraje pendiente', colorClass: 'bg-status-arbitration' },
  READY_TO_RELEASE: { label: 'Listo para liberar', colorClass: 'bg-status-ready' },
  RELEASED: { label: 'Liberado', colorClass: 'bg-status-released' },
  CANCELLED: { label: 'Cancelado', colorClass: 'bg-status-cancelled' },
  EXCEPTION: { label: 'Excepción', colorClass: 'bg-status-exception' },
};
