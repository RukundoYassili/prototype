import { createApp } from './app.mjs';
import { createEditorialStore } from './editorial-store.mjs';
const editorialStore = createEditorialStore(process.env.EDITORIAL_DATABASE_URL);
const { app } = createApp({ dataDir: process.env.MEDIA_DATA_DIR, origin: process.env.MEDIA_ORIGIN, editorialStore, trustProxy: true, secureCookies: !(process.env.NODE_ENV !== 'production' && process.env.MEDIA_INSECURE_DEV === '1') });
app.listen(Number(process.env.PORT || 3000), process.env.MEDIA_LISTEN || '0.0.0.0', () => console.log('Media service listening.'));
