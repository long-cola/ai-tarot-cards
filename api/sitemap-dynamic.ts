import { getPool } from '../services/db.js';

/**
 * Dynamic Sitemap Generator
 * Generates sitemap entries for all public shared readings
 */
export default async function handler(req: any, res: any) {
  const pool = getPool();

  try {
    // Get all shared readings (limit to recent 1000 for performance)
    const result = await pool.query(
      `SELECT id, created_at, view_count
       FROM shared_readings
       WHERE created_at > NOW() - INTERVAL '90 days'
       ORDER BY created_at DESC
       LIMIT 1000`
    );

    const baseUrl = 'https://ai-tarotcard.com';
    const now = new Date().toISOString();

    // Generate XML sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/zh/</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/topics</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Shared Readings -->
`;

    // Add each shared reading
    for (const row of result.rows) {
      const lastmod = new Date(row.created_at).toISOString().split('T')[0];
      // Priority based on view count and recency
      const priority = Math.max(0.3, Math.min(0.6, 0.3 + (row.view_count / 100) * 0.1));

      xml += `  <url>
    <loc>${baseUrl}/?shareId=${row.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    return res.status(200).send(xml);
  } catch (error: any) {
    console.error('[sitemap-dynamic] Error:', error);
    return res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
}

export const config = {
  maxDuration: 10,
};
