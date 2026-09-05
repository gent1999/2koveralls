export const config = {
  matcher: '/',
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';

  const isSocialBot = /facebookexternalhit|twitterbot|slackbot|telegrambot|whatsapp|linkedinbot|discordbot|pinterestbot/i.test(userAgent);

  if (!isSocialBot) {
    return; // Let Vercel serve index.html normally for regular users
  }

  const siteUrl = 'https://www.2koveralls.com/';
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
  <link rel="canonical" href="${siteUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${siteUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1672">
  <meta property="og:image:height" content="941">
  <meta property="og:site_name" content="2koveralls">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${siteUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache',
    },
  });
}
