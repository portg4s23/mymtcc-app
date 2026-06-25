import { useEffect, useState } from "react";

type UseLiveTimeOptions = {
  intervalMs?: number;
  syncToSecond?: boolean;
};

export const useLiveTime = (options: UseLiveTimeOptions = {}) => {
  const { intervalMs = 1000, syncToSecond = true } = options;

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!syncToSecond) {
      const interval = setInterval(() => {
        setNow(new Date());
      }, intervalMs);

      return () => clearInterval(interval);
    }

    const tick = () => setNow(new Date());

    const nowDate = new Date();
    const msToNextTick = 1000 - nowDate.getMilliseconds();

    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 1000);
    }, msToNextTick);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [intervalMs, syncToSecond]);

  return now;
};