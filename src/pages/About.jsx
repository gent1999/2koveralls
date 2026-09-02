import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen text-gray-900" style={{
      backgroundColor: '#f5f5f5',
      backgroundImage: `
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
        linear-gradient(135deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5),
        linear-gradient(45deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.08) 100%)
      `,
      backgroundSize: '100% 100%, 100% 100%, 20px 20px, 100% 100%'
    }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border-2 border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 text-orange-600">About 2koveralls</h1>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Welcome to <strong>2koveralls</strong>, your hub for trending rap news, 2K-style rapper ratings, and in-depth artist write-ups.
            </p>

            <p>
              We bring you the latest discussions and news from the rap world, rank your favorite artists with NBA 2K-style overall ratings, and spotlight emerging talent through our exclusive write-ups.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black">What We Offer</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-orange-600 mb-2">Trends</h3>
                <p>
                  Stay up to date with the hottest topics and discussions in the rap game. From breaking news to trending controversies, we cover what everyone's talking about.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-orange-600 mb-2">2K Overalls</h3>
                <p>
                  Browse our searchable database of rapper ratings, featuring NBA 2K-style overall scores with detailed explanations. Find your favorite artists and see how they stack up.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-orange-600 mb-2">Write Ups</h3>
                <p>
                  Deep dives into rising artists, album reviews, and exclusive features. Our 1of1 Originals shine a spotlight on underground talent you need to know about.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Stay Connected</h2>
            <p>
              Follow us on Instagram <a href="https://www.instagram.com/2k_overalls" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 font-medium">@2k_overalls</a> for daily updates and the latest ratings.
            </p>

            <p>
              Whether you're here for the news, the ratings, or discovering new artists, 2koveralls has you covered.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
