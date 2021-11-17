import { useEffect } from "react";
import { useItems } from "../AppContext";

export default function useReminderNotification() {
  const { pending, paused } = useItems();

  useEffect(() => {
    if (Notification.permission === 'granted') {
      return;
    }

    Notification.requestPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nd = new Date();
      const is30MinuteInterval = nd.getMinutes() % 30 === 0 && nd.getSeconds() === 0;

      if (is30MinuteInterval && (pending.length > 0 || paused.length > 0)) {
        let text = `Don't forget, you have ${pending.length +
          paused.length} tasks to do today (${pending.length} incomplete, ${paused.length
          } paused for later)`;

        new Notification("todometer reminder!", {
          body: text
        });
      } else {
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pending.length, paused.length]);
}
