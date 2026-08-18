const activeVisitors = new Map();

/**
 * Middleware or utility to record client activity
 */
const trackVisitor = (req) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  activeVisitors.set(ip, Date.now());
};

/**
 * Returns number of unique IPs active within the specified time window (minutes)
 */
const getOnlineVisitorsCount = (windowMinutes = 5) => {
  const cutoff = Date.now() - windowMinutes * 60 * 1000;
  let count = 0;
  for (const [ip, lastSeen] of activeVisitors.entries()) {
    if (lastSeen >= cutoff) {
      count++;
    } else {
      activeVisitors.delete(ip);
    }
  }
  return Math.max(count, 1);
};

module.exports = {
  trackVisitor,
  getOnlineVisitorsCount,
};
