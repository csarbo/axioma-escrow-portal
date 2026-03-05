import { useState } from 'react';
import { Upload, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import { CaseDocument, Incoterm, getRequiredDocs, DocumentStatus } from '@/types/case';
import { Button } from '@/components/ui/button';

interface DocumentChecklistProps {
  incoterm: Incoterm;
  documents: CaseDocument[];
  onUpload?: (docType: string, fileName: string) => void;
  readOnly?: boolean;
}

const statusIcon: Record<DocumentStatus, React.ReactNode> = {
  PENDING: <Clock className="h-4 w-4 text-muted-foreground" />,
  UPLOADED: <Upload className="h-4 w-4 text-status-funding" />,
  VALIDATED: <CheckCircle2 className="h-4 w-4 text-status-released" />,
  REJECTED: <XCircle className="h-4 w-4 text-destructive" />,
};

const statusLabel: Record<DocumentStatus, string> = {
  PENDING: 'Pendiente',
  UPLOADED: 'Subido',
  VALIDATED: 'Validado ✓',
  REJECTED: 'Rechazado',
};

export function DocumentChecklist({ incoterm, documents, onUpload, readOnly }: DocumentChecklistProps) {
  const required = getRequiredDocs(incoterm);

  const getDocForType = (type: string) => documents.find(d => d.type === type);

  const simulateUpload = (docType: string) => {
    const fakeNames: Record<string, string> = {
      'Factura comercial': 'Factura_comercial.pdf',
      'Bill of Lading': 'BL_documento.pdf',
      'Packing list': 'Packing_list.pdf',
      'Confirmación de embarque': 'Confirmacion_embarque.pdf',
      'Carta porte': 'Carta_porte.pdf',
      'Foto de entrega': 'Foto_entrega.jpg',
    };
    onUpload?.(docType, fakeNames[docType] || 'documento.pdf');
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground mb-3">
        Documentos requeridos ({incoterm})
      </h4>
      {required.map((req) => {
        const doc = getDocForType(req.type);
        const status: DocumentStatus = doc?.status || 'PENDING';

        return (
          <div key={req.type} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{req.name}</p>
                {doc?.name && <p className="text-xs text-muted-foreground">{doc.name}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs">
                {statusIcon[status]}
                <span className="text-muted-foreground">{statusLabel[status]}</span>
              </span>
              {!readOnly && status === 'PENDING' && onUpload && (
                <Button size="sm" variant="outline" onClick={() => simulateUpload(req.type)} className="text-xs h-7">
                  <Upload className="h-3 w-3 mr-1" /> Subir
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
