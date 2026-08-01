type NotificationListener = (event: any) => void;

class NotificationService {
  private listeners: Map<string, NotificationListener>;

  constructor() {
    this.listeners = new Map();
  }

  subscribe(listenerId: string, callback: NotificationListener): () => void {
    this.listeners.set(listenerId, callback);
    return () => {
      this.listeners.delete(listenerId);
    };
  }

  pushPaymentNotification({ driverId, payload }: { driverId: string; payload: any }): void {
    const listener = this.listeners.get('app_context');
    if (listener) {
      listener({ type: 'PAYMENT_RECEIVED', driverId, payload });
    }
  }
}

export default new NotificationService();
