import './StaticPage.css';

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Most orders ship within 24-48 hours and arrive in 3-7 business days depending on your location. Mumbai addresses often see next-day delivery.',
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes — Cash on Delivery is available on every order. You can also pay online via UPI, cards, or net banking through Razorpay.',
  },
  {
    q: 'What is your return policy?',
    a: 'Unused products in original packaging can be returned within 7 days of delivery. Defective items are replaced or refunded at no extra cost.',
  },
  {
    q: 'Do drones need a licence to fly in India?',
    a: 'Drones under 250g (like most of our beginner models) generally don’t require a licence, but always check the latest DGCA Digital Sky rules before flying, especially near airports or restricted zones.',
  },
  {
    q: 'Do you offer spare parts and repairs?',
    a: 'Yes — we stock batteries, propellers, motors, and tires for most products we sell, and our support team can help diagnose common issues over WhatsApp.',
  },
  {
    q: 'Can I track my order?',
    a: 'Once signed in, visit My Orders to see the live status of every order, from placed to delivered.',
  },
];

export default function FAQ() {
  return (
    <div className="container static-page">
      <h1>Frequently Asked Questions</h1>
      <p className="lede">Can&rsquo;t find what you&rsquo;re looking for? Reach out on our Contact page.</p>

      {FAQS.map((f) => (
        <div className="faq-item" key={f.q}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  );
}
