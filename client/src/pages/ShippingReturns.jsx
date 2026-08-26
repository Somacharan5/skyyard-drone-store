import { BRAND } from '../config/brand';
import './StaticPage.css';

export default function ShippingReturns() {
  return (
    <div className="container static-page">
      <h1>Shipping &amp; Returns</h1>
      <p className="lede">Everything you need to know about getting your order, and sending it back if needed.</p>

      <section>
        <h2>Shipping</h2>
        <ul>
          <li>Free shipping on all prepaid and COD orders across India.</li>
          <li>Orders are dispatched within 24-48 hours of confirmation.</li>
          <li>Estimated delivery: 1-2 days in Mumbai, 3-7 business days nationwide.</li>
          <li>You&rsquo;ll receive tracking details by SMS and email once your order ships.</li>
        </ul>
      </section>

      <section>
        <h2>Returns &amp; Replacements</h2>
        <ul>
          <li>Return unused items in original packaging within 7 days of delivery.</li>
          <li>Defective or damaged items are replaced free of charge — just share a photo or video with our team.</li>
          <li>Refunds for prepaid orders are processed within 5-7 business days of the item reaching our warehouse.</li>
          <li>Batteries, chargers, and used consumables are non-returnable for safety reasons.</li>
        </ul>
      </section>

      <section>
        <h2>Need help with a return?</h2>
        <p>
          Message us on WhatsApp or call {BRAND.phone} with your order number, and we&rsquo;ll walk you through the
          process.
        </p>
      </section>
    </div>
  );
}
