import { useEffect, useState } from 'react';

function formatKarachiTime(): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const pkt = new Date(utcMs + 5 * 3600000);
    const hh = String(pkt.getHours()).padStart(2, '0');
    const mm = String(pkt.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
}

export function useKarachiTime(): string {
  const [time, setTime] = useState<string>(() => formatKarachiTime());

  useEffect(() => {
    setTime(formatKarachiTime());
    const interval = window.setInterval(() => {
      setTime(formatKarachiTime());
    }, 10000);
    return () => window.clearInterval(interval);
  }, []);

  return time;
}
