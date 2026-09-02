import Footer from '../components/Footer';

export default function DMCA() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border border-ink-line bg-ink-soft p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 text-brand">DMCA Policy</h1>

          <div className="space-y-6 text-bone-dim leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">Copyright Infringement Notice</h2>
              <p>
                2koveralls respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond promptly to claims of copyright infringement on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">Filing a DMCA Notice</h2>
              <p>
                If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, you may notify us by providing our copyright agent with the following information in writing:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>An electronic or physical signature of the copyright owner or authorized representative</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing, with information reasonably sufficient to permit us to locate the material</li>
                <li>Your contact information (address, telephone number, and email address)</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law</li>
                <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">Counter-Notification</h2>
              <p>
                If you believe that your content was removed or disabled by mistake or misidentification, you may file a counter-notification with us by providing the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Your physical or electronic signature</li>
                <li>Identification of the content that has been removed or disabled and the location where it appeared</li>
                <li>A statement under penalty of perjury that you have a good faith belief that the content was removed by mistake or misidentification</li>
                <li>Your name, address, telephone number, and email address</li>
                <li>A statement that you consent to the jurisdiction of the federal court in your district</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">Repeat Infringers</h2>
              <p>
                We will terminate the accounts of users who are repeat infringers of copyright in appropriate circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">Contact Information</h2>
              <p>
                Please send DMCA notices and counter-notifications to us through our Contact page. Please clearly mark your communication as a "DMCA Notice" or "DMCA Counter-Notification."
              </p>
              <p className="mt-3">
                Note: Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
