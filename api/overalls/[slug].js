export default async function handler(req, res) {
  const { slug } = req.query;
  const userAgent = req.headers['user-agent'] || '';

  // Helper to serve the SPA index.html
  const serveIndex = async () => {
    try {
      const indexResponse = await fetch(`https://${req.headers.host}/index.html`);
      const indexHtml = await indexResponse.text();
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(indexHtml);
    } catch (error) {
      console.error('Error fetching index.html:', error);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send('<html><body><script>window.location.href="/"</script></body></html>');
    }
  };

  if (!slug) {
    return serveIndex();
  }

  // Only detect social media preview bots (NOT search engine crawlers like Googlebot)
  const isSocialBot = /facebookexternalhit|twitterbot|slackbot|telegrambot|whatsapp|linkedinbot|discordbot|pinterestbot/i.test(userAgent);

  // If not a social media bot, serve the React SPA
  if (!isSocialBot) {
    return serveIndex();
  }

  try {
    const apiUrl = process.env.VITE_API_URL || 'https://server808.vercel.app';
    const response = await fetch(`${apiUrl}/api/overalls/slug/${slug}`);

    if (!response.ok) {
      res.status(404).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Overall Not Found | 2koveralls</title>
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>Overall Not Found</h1>
  <p><a href="/">Return to 2koveralls Home</a></p>
</body>
</html>`);
      return;
    }

    const overall = await response.json();

    // Strip markdown from content for description
    const stripMarkdown = (text) => {
      return text
        .replace(/[#*_~`>\[\]]/g, '')
        .replace(/\n+/g, ' ')
        .trim();
    };

    const description = stripMarkdown(overall.content).substring(0, 160) + '...';
    const url = `https://www.2koveralls.com/overalls/${slug}`;

    // Resize image to 1200x630 for optimal Open Graph display
    let ogImage = '';
    if (overall.image_url) {
      ogImage = `https://images.weserv.nl/?url=${encodeURIComponent(overall.image_url)}&w=1200&h=630&fit=cover&output=jpg`;
    }

    // Generate JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": overall.title,
      "description": description,
      "image": ogImage || overall.image_url,
      "datePublished": overall.created_at,
      "dateModified": overall.updated_at || overall.created_at,
      "publisher": {
        "@type": "Organization",
        "name": "2koveralls",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.2koveralls.com/og-image.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${overall.title} Overall Rating | 2koveralls</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">

  <!-- Structured Data for Google Rich Results -->
  <script type="application/ld+json">
  ${JSON.stringify(structuredData)}
  </script>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${overall.title}">
  <meta property="og:description" content="${description}">
  ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}
  ${ogImage ? `<meta property="og:image:width" content="1200">` : ''}
  ${ogImage ? `<meta property="og:image:height" content="630">` : ''}
  ${ogImage ? `<meta property="og:image:type" content="image/jpeg">` : ''}
  <meta property="og:site_name" content="2koveralls">
  <meta property="article:published_time" content="${overall.created_at}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${overall.title}">
  <meta name="twitter:description" content="${description}">
  ${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ''}
</head>
<body>
  <h1>${overall.title}</h1>
  <p>${new Date(overall.created_at).toLocaleDateString()}</p>
  <p>${description}</p>
  ${ogImage ? `<img src="${ogImage}" alt="${overall.title}" style="max-width: 100%; height: auto;">` : ''}
  <p><a href="/overalls/${slug}">View full rating</a></p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching overall for crawler:', error);
    res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error Loading Overall | 2koveralls</title>
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>Error Loading Overall</h1>
  <p>Sorry, there was an error loading this page. Please try again later.</p>
  <p><a href="/">Return to 2koveralls Home</a></p>
</body>
</html>`);
  }
}
