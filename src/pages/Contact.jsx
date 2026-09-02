import { useState } from 'react';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    setStatus('Thanks for reaching out! We\'ll hit you back soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border border-ink-line bg-ink-soft p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 text-brand">Contact Us</h1>

          <p className="text-bone-dim mb-8">
            Got a question, story tip, or just want to say what's up? Hit us up using the form below and we'll get back to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-bone-dim mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-ink-line bg-ink text-bone placeholder-bone-dim focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-bone-dim mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-ink-line bg-ink text-bone placeholder-bone-dim focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-bone-dim mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-ink-line bg-ink text-bone placeholder-bone-dim focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-bone-dim mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-2 border-2 border-ink-line bg-ink text-bone placeholder-bone-dim focus:border-brand focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-brand text-ink font-bold uppercase tracking-wide hover:bg-transparent hover:text-brand border border-brand transition-colors"
            >
              Send Message
            </button>

            {status && (
              <div className="mt-4 border-2 border-up bg-ink p-4 text-up">
                {status}
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
