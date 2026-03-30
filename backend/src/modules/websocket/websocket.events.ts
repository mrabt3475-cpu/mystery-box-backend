// WebSocket Events Types
export interface ServerToClientEvents {
  notification: (data: NotificationEvent) => void;
  prize_won: (data: PrizeWonEvent) => void;
  box_opened: (data: BoxOpenedEvent) => void;
  job_update: (data: JobUpdateEvent) => void;
  unread_count: (data: UnreadCountEvent) => void;
  connected: (data: ConnectedEvent) => void;
  error: (data: ErrorEvent) => void;
}

export interface ClientToServerEvents {
  ping: () => void;
  subscribe: (data: SubscribeEvent) => void;
  unsubscribe: (data: SubscribeEvent) => void;
}

export interface NotificationEvent {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  createdAt: string;
}

export interface PrizeWonEvent {
  prizeName: string;
  prizeType: string;
  prizeValue: number;
  boxType: string;
  timestamp: number;
}

export interface BoxOpenedEvent {
  boxId: string;
  boxType: string;
  prize: PrizeWonEvent;
}

export interface JobUpdateEvent {
  jobId: number;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  result?: any;
}

export interface UnreadCountEvent {
  count: number;
}

export interface ConnectedEvent {
  userId: string;
  message: string;
}

export interface ErrorEvent {
  code: string;
  message: string;
}

export interface SubscribeEvent {
  channel: string;
}
