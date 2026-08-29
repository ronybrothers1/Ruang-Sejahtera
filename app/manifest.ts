import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest { return { name: 'Yayasan Ruang Sejahtera', short_name: 'Ruang Sejahtera', description: 'Platform resmi Yayasan Ruang Sejahtera.', start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#d71920', lang: 'id' }; }
