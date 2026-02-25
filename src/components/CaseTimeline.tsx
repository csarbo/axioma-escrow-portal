import { CaseEvent } from '@/types/case';
import { formatDateMX } from '@/data/mock';
import { FileText, CheckCircle, DollarSign, Lock, AlertTriangle, Scale, ArrowRight, XCircle, Upload } from 'lucide-react';

const eventIcons: Record<CaseEvent['type'], React.ReactNode> = {
  CREATED: <FileText className="h-4 w-4" />,
  ACCEPTED: <CheckCircle className="h-4 w-4" />,
  FUNDED: <DollarSign className="h-4 w-4" />,
  ESCROW_CREATED: <Lock className="h-4 w-4" />,
  DISPUTE_OPENED: <AlertTriangle className="h-4 w-4" />,
  ARBITRATION_STARTED: <Scale className="h-4 w-4" />,
  RELEASED: <ArrowRight className="h-4 w-4" />,
  REFUNDED: <ArrowRight className="h-4 w-4" />,
  CANCELLED: <XCircle className="h-4 w-4" />,
  DOCUMENT_UPLOADED: <Upload className="h-4 w-4" />,
};

interface CaseTimelineProps {
  events: CaseEvent[];
}

export function CaseTimeline({ events }: CaseTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={event.id} className="relative flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border border-border text-accent">
              {eventIcons[event.type]}
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-medium text-foreground">{event.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {event.actor} — {formatDateMX(event.timestamp)}{' '}
                {new Date(event.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
