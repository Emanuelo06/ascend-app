import { Habit, HabitCheckin, HabitMetrics } from '@/types';

export interface RealtimeUpdate {
  type: 'habit_created' | 'habit_updated' | 'habit_deleted' | 'checkin_recorded' | 'streak_updated';
  data: any;
  timestamp: string;
  userId: string;
}

export interface RealtimeStats {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  weeklyProgress: number;
  lastUpdated: string;
}

class RealtimeHabitService {
  private static instance: RealtimeHabitService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(update: RealtimeUpdate) => void>> = new Map();
  private isConnected = false;

  private constructor() {
    this.initializeWebSocket();
  }

  static getInstance(): RealtimeHabitService {
    if (!RealtimeHabitService.instance) {
      RealtimeHabitService.instance = new RealtimeHabitService();
    }
    return RealtimeHabitService.instance;
  }

  private initializeWebSocket() {
    try {
      // In development, use a mock WebSocket
      if (process.env.NODE_ENV === 'development') {
        this.setupMockWebSocket();
        return;
      }

      // In production, connect to real WebSocket server
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://your-websocket-server.com';
      this.ws = new WebSocket(wsUrl);
      this.setupWebSocketHandlers();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.setupMockWebSocket();
    }
  }

  private setupMockWebSocket() {
    // Simulate real-time updates for development
    setInterval(() => {
      this.simulateRealtimeUpdate();
    }, 5000); // Update every 5 seconds
  }

  private simulateRealtimeUpdate() {
    const mockUpdates: RealtimeUpdate[] = [
      {
        type: 'streak_updated',
        data: { habitId: '1', newStreak: Math.floor(Math.random() * 20) + 1 },
        timestamp: new Date().toISOString(),
        userId: 'demo-user'
      },
      {
        type: 'checkin_recorded',
        data: { habitId: '2', status: 'done', timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString(),
        userId: 'demo-user'
      }
    ];

    const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
    this.notifyListeners(randomUpdate);
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const update: RealtimeUpdate = JSON.parse(event.data);
        this.notifyListeners(update);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.initializeWebSocket();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  // Subscribe to real-time updates
  subscribe(userId: string, callback: (update: RealtimeUpdate) => void): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set());
    }

    this.listeners.get(userId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const userListeners = this.listeners.get(userId);
      if (userListeners) {
        userListeners.delete(callback);
        if (userListeners.size === 0) {
          this.listeners.delete(userId);
        }
      }
    };
  }

  private notifyListeners(update: RealtimeUpdate) {
    const userListeners = this.listeners.get(update.userId);
    if (userListeners) {
      userListeners.forEach(callback => {
        try {
          callback(update);
        } catch (error) {
          console.error('Error in real-time update callback:', error);
        }
      });
    }
  }

  // Send real-time update to other users (for social features)
  broadcastUpdate(update: Omit<RealtimeUpdate, 'timestamp'>) {
    const fullUpdate: RealtimeUpdate = {
      ...update,
      timestamp: new Date().toISOString()
    };

    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(fullUpdate));
    }

    // Also notify local listeners
    this.notifyListeners(fullUpdate);
  }

  // Get real-time stats
  async getRealtimeStats(userId: string): Promise<RealtimeStats> {
    try {
      // In development, return mock stats
      if (process.env.NODE_ENV === 'development') {
        return {
          totalHabits: Math.floor(Math.random() * 10) + 5,
          completedToday: Math.floor(Math.random() * 5) + 1,
          currentStreak: Math.floor(Math.random() * 15) + 1,
          weeklyProgress: Math.floor(Math.random() * 30) + 70,
          lastUpdated: new Date().toISOString()
        };
      }

      // In production, fetch from API
      const response = await fetch(`/api/habits/stats/realtime?userId=${userId}`);
      if (response.ok) {
        return await response.json();
      }

      throw new Error('Failed to fetch real-time stats');
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      throw error;
    }
  }

  // Cleanup
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default RealtimeHabitService;
