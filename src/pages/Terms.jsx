import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border border-ink-line bg-ink-soft p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 text-brand">Terms of Use</h1>

          <p className="text-sm text-bone-dim mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-bone-dim leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">1. Acceptance of Terms</h2>
              <p>
                By accessing and using 2koveralls, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials on 2koveralls for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on 2koveralls</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">3. User Content</h2>
              <p>
                When you submit music, comments, or other content to 2koveralls, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content in connection with our services.
              </p>
              <p className="mt-3">
                You represent and warrant that you own or have the necessary rights to the content you submit and that such content does not infringe on the intellectual property rights of any third party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">4. Disclaimer</h2>
              <p>
                The materials on 2koveralls are provided on an 'as is' basis. 2koveralls makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">5. Limitations</h2>
              <p>
                In no event shall 2koveralls or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 2koveralls.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">6. External Links</h2>
              <p>
                2koveralls may contain links to third-party websites or services that are not owned or controlled by 2koveralls. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">7. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Use the website for any illegal purpose or in violation of any laws</li>
                <li>Post or transmit any harmful, threatening, abusive, or hateful content</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the website or servers</li>
                <li>Collect or store personal data about other users without their consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">8. Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our website immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">9. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-bone">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us through our Contact page.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
