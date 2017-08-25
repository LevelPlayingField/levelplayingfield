import fs from 'fs';
import path from 'path';
import { host } from '../src/config';
import { Case, Party } from '../src/data/models';

function arrayChunks(array, size) {
  const results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
}

const siteMapIndex = (sitemaps: Array<string>, lastmod: Date) => (`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${
  sitemaps.map(sitemapUrl => `
  <sitemap>
    <loc>${sitemapUrl}</loc>
    <lastmod>${lastmod.toISOString()}</lastmod>
  </sitemap>`).join('')
  }
</sitemapindex>`);

const siteMap = (locations: Array<{ loc: string, lastmod: Date }>) => (`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locations.map(({ loc, lastmod }) => (
  `<url><loc>${loc}</loc><lastmod>${lastmod.toISOString()}</lastmod></url>`
)).join('\n')}</urlset>`);

export default async function updateSitemap() {
  const publicPath = path.join(__dirname, '../src/public');
  const cases = await Case.findAll();
  const parties = await Party.findAll();

  const allUrls = [
    {
      loc: `https://${host}/home`,
      lastmod: new Date(fs.statSync(path.join(__dirname, '../src/routes/home/Home.md')).mtime),
    },
    {
      loc: `https://${host}/privacy`,
      lastmod: new Date(fs.statSync(path.join(__dirname, '../src/routes/privacy/Privacy.md')).mtime),
    },
    {
      loc: `https://${host}/about-us`,
      lastmod: new Date(fs.statSync(path.join(__dirname, '../src/routes/about-us/About.md')).mtime),
    },
    {
      loc: `https://${host}/search-help`,
      lastmod: new Date(
        fs.statSync(path.join(__dirname, '../src/routes/search-help/SearchHelp.md')).mtime),
    },

    ...cases.map(c => ({
      loc: `https://${host}/case/${c.case_id}`,
      lastmod: new Date(c.updated_at),
    })),
    ...parties.map(p => ({
      loc: `https://${host}/party/${p.slug}`,
      lastmod: new Date(p.updated_at),
    })),
  ];
  const maxLastMod = allUrls.map(l => l.lastmod).reduce((a, b) => (a > b ? a : b));
  const chunks = arrayChunks(allUrls, 50000);
  const siteMaps = chunks.map((chunk, idx) => {
    const fileName = `sitemap-${idx}.xml`;
    const filePath = path.join(publicPath, fileName);
    const siteMapUrl = `https://${host}/public/${fileName}`;

    fs.writeFileSync(filePath, siteMap(chunk));

    return siteMapUrl;
  });

  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), siteMapIndex(siteMaps, maxLastMod));
}
