export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  // Only detect social media preview bots (NOT search engine crawlers like Googlebot)
  const isSocialBot = /facebookexternalhit|twitterbot|slackbot|telegrambot|whatsapp|linkedinbot|discordbot|pinterestbot/i.test(userAgent);

  if (!isSocialBot) {
    // Serve the React SPA for regular users
    try {
      const indexResponse = await fetch(`https://${req.headers.host}/index.html`);
      const indexHtml = await indexResponse.text();
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(indexHtml);
    } catch (error) {
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send('<html><body><script>window.location.href="/"</script></body></html>');
    }
  }

  const url = 'https://www.2koveralls.com/';
  const title = '2koveralls - Underground Hip Hop News & 2K Rapper Ratings';
  const description = 'Your source for underground hip-hop news, 2K rapper overall ratings, exclusive interviews, and music culture. Stay updated with daily rap & hip-hop content.';
  const image = 'https://www.2koveralls.com/2koveralls_banner.png';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1672">
  <meta property="og:image:height" content="941">
  <meta property="og:site_name" content="2koveralls">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${image}" alt="2koveralls" style="max-width: 100%; height: auto;">
  <p><a href="/">Visit 2koveralls</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
