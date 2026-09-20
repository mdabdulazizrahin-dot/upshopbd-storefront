import { CourierNote } from '@/hooks/useCourierNotes';
import { Badge } from '@/components/ui/badge';
import { User, Truck, Settings } from 'lucide-react';

interface CourierTimelineProps {
  notes: CourierNote[];
  isLoading?: boolean;
}

const CourierTimeline = ({ notes, isLoading }: CourierTimelineProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">কোনো courier আপডেট নেই</p>
      </div>
    );
  }

  const getSourceConfig = (source: string) => {
    switch (source) {
      case 'courier':
        return { icon: Truck, label: 'Courier', color: 'bg-blue-100 text-blue-700 border-blue-300', bgColor: 'bg-blue-500' };
      case 'admin':
        return { icon: User, label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-300', bgColor: 'bg-purple-500' };
      default:
        return { icon: Settings, label: 'System', color: 'bg-gray-100 text-gray-700 border-gray-300', bgColor: 'bg-gray-500' };
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  };

  return (
    <div className="relative">
      <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-border" />
      <div className="space-y-6">
        {notes.map((note) => {
          const config = getSourceConfig(note.source);
          const Icon = config.icon;
          const { date, time } = formatDateTime(note.created_at);
          return (
            <div key={note.id} className="relative flex gap-4">
              <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${config.bgColor} text-white shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className={config.color}>{config.label}</Badge>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{date}</div>
                    <div>{time}</div>
                  </div>
                </div>
                <p className="text-foreground">{note.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourierTimeline;
