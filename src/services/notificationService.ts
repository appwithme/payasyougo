/** In-process pub/sub retired — driver updates come from API polling/refresh. */
type Handler = (event: any) => void;

class NotificationService {
  subscribe(_id: string, _handler: Handler) {
    return () => undefined;
  }
  pushPaymentNotification(_args: any) {
    // no-op until Expo push is wired
  }
}

export default new NotificationService();
