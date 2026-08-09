/**
 * Public Expo env. Set in project root `.env`:
 *   EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:4000
 */
const rawUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export const API_URL = rawUrl.replace(/\/$/, '');
