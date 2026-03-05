import { TimelineEvent } from '@/types/case';

interface CaseTimelineProps {
  events: TimelineEvent[];
}

export function CaseTimeline({ events }: CaseTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={i} className="flex gap-4 relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-sm z-10 shrink-0">
              {event.icon}
            </div>
            <div className="pt-1">
              <p className="text-sm font-medium text-foreground">{event.event}</p>
              <p className="text-xs text-muted-foreground">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
