import { useState } from 'react';
import client, { apiErrorMessage } from '../api/client';
import { BRAND } from '../config/brand';
import { MapPin, Phone, Mail } from '../icons/Icon';
import './StaticPage.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await client.post('/contact', form);
      setSent(true);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not send your message'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container static-page">
      <h1>Contact Us</h1>
      <p className="lede">Questions about an order, a product, or a repair? We&rsquo;re happy to help.</p>

      <div className="static-grid">
        <div>
          <MapPin size={22} />
          <strong>Visit the store</strong>
          <p>{BRAND.address}</p>
        </div>
        <div>
          <Phone size={22} />
          <strong>Call or WhatsApp</strong>
          <p>
            <a href={BRAND.phoneHref}>{BRAND.phone}</a> &middot;{' '}
            <a href={BRAND.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </p>
        </div>
      </div>

      <div className="contact-form">
        {sent ? (
          <div className="alert alert-success">Thanks — your message has been sent. We&rsquo;ll reply within 24 hours.</div>
        ) : (
          <form onSubmit={onSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-row">
              <div className="form-field">
                <label>Your name</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>Email address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-field">
              <label>Subject</label>
              <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Message</label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
