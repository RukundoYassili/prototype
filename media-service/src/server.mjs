import { createApp } from './app.mjs';
const { app } = createApp({ dataDir: process.env.MEDIA_DATA_DIR, origin: process.env.MEDIA_ORIGIN, trustProxy: true, secureCookies: !(process.env.NODE_ENV !== 'production' && process.env.MEDIA_INSECURE_DEV === '1') });
app.listen(Number(process.env.PORT || 3000), process.env.MEDIA_LISTEN || '0.0.0.0', () => console.log('Media service listening.'));
