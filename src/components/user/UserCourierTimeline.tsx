import { CourierNote } from '@/hooks/useCourierNotes';
import { Badge } from '@/components/ui/badge';
import { User, Truck, Settings } from 'lucide-react';

interface UserCourierTimelineProps {
  notes: CourierNote[];
  isLoading?: boolean;
}

const UserCourierTimeline = ({ notes, isLoading }: UserCourierTimelineProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-full" />
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
      <div className="text-center py-6 text-muted-foreground">
        <Truck className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">কোনো কুরিয়ার আপডেট নেই</p>
      </div>
    );
  }

  const getSourceConfig = (source: string) => {
    switch (source) {
      case 'courier':
        return {
          icon: Truck,
          label: 'কুরিয়ার',
          color: 'bg-blue-100 text-blue-700 border-blue-300',
          bgColor: 'bg-blue-500',
        };
      case 'admin':
        return {
          icon: User,
          label: 'অ্যাডমিন',
          color: 'bg-purple-100 text-purple-700 border-purple-300',
          bgColor: 'bg-purple-500',
        };
      case 'system':
        return {
          icon: Settings,
          label: 'সিস্টেম',
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          bgColor: 'bg-gray-500',
        };
      default:
        return {
          icon: Settings,
          label: source,
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          bgColor: 'bg-gray-500',
        };
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('bn-BD', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('bn-BD', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
    };
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
      
      <div className="space-y-4">
        {notes.map((note) => {
          const sourceConfig = getSourceConfig(note.source);
          const Icon = sourceConfig.icon;
          const { date, time } = formatDateTime(note.created_at);
          
          return (
            <div key={note.id} className="relative flex gap-3">
              {/* Icon circle */}
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${sourceConfig.bgColor} text-white shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-card border border-border rounded-lg p-3 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge variant="outline" className={`${sourceConfig.color} text-xs`}>
                    {sourceConfig.label}
                  </Badge>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{date}</div>
                    <div>{time}</div>
                  </div>
                </div>
                <p className="text-sm text-foreground">{note.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserCourierTimeline;
