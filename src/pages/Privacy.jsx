import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border border-ink-line bg-ink-soft p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 text-brand">Privacy Policy</h1>

          <p className="text-sm text-bone-dim mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-bone-dim leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you subscribe to our newsletter, submit music, or contact us. This may include your name, email address, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Send you newsletters and updates about underground hip hop news</li>
                <li>Respond to your inquiries and requests</li>
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and trends</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">3. Cookies and Tracking</h2>
              <p>
                We may use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">4. Third-Party Services</h2>
              <p>
                We may use third-party services such as analytics providers and advertising partners. These third parties may have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">5. Data Security</h2>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">6. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time. If you wish to exercise these rights, please contact us using the information provided in our Contact page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">7. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our Contact page.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
