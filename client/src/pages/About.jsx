import { BRAND } from '../config/brand';
import { Truck, Shield, Rotate, Phone } from '../icons/Icon';
import './StaticPage.css';

export default function About() {
  return (
    <div className="container static-page">
      <h1>About {BRAND.name}</h1>
      <p className="lede">{BRAND.tagline} — built by people who fly, drive, and shoot the products we sell.</p>

      <section>
        <h2>Our story</h2>
        <p>
          {BRAND.name} started as a small hobby shop for RC enthusiasts and grew into an online store shipping
          drones, RC cars, planes, gel blasters, and gadgets across India. We test every product line ourselves
          before it goes live, and our support team can talk you through a repair, not just a return.
        </p>
      </section>

      <div className="static-grid">
        <div>
          <Truck size={22} />
          <strong>Nationwide shipping</strong>
          <p>Fast, tracked delivery to every pincode we service, with same-day dispatch on in-stock orders.</p>
        </div>
        <div>
          <Shield size={22} />
          <strong>Genuine products</strong>
          <p>Every product is sourced directly from the brand or an authorised distributor — no grey-market imports.</p>
        </div>
        <div>
          <Rotate size={22} />
          <strong>After-sales support</strong>
          <p>Spare parts, repair guidance, and warranty support long after your order arrives.</p>
        </div>
        <div>
          <Phone size={22} />
          <strong>Real humans</strong>
          <p>
            Call or WhatsApp us at {BRAND.phone} — you&rsquo;ll reach someone who actually flies this stuff.
          </p>
        </div>
      </div>

      <section>
        <h2>What we sell</h2>
        <p>
          Camera and racing drones, drift and crawler RC cars, foam gliders and scale helicopters, gel blaster
          rifles, action cameras and gimbals, plus the batteries, propellers, and spares that keep it all running.
        </p>
      </section>
    </div>
  );
}
