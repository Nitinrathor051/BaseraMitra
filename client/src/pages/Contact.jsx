import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import "../styles/contact.css";

const Contact = () => {
  return (
    <section className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="container">

          <span className="contact-badge">
            Contact BaseraMitra
          </span>

          <h1>Let's Connect</h1>

          <p>
            Whether you're looking to buy, rent or list a property,
            we're here to help you every step of the way.
          </p>

        </div>
      </section>

      {/* Contact Cards */}
      <section className="contact-section">
        <div className="container">

          <div className="contact-grid">

            <div className="contact-card">
              <MapPin size={34} />

              <h3>Office Address</h3>

              <p>
                Gwalior,
                <br />
                Madhya Pradesh, India
              </p>
            </div>

            <div className="contact-card">
              <Phone size={34} />

              <h3>Call Us</h3>

              <a href="tel:+91XXXXXXXXXX">
                +91 XXXXX XXXXX
              </a>
            </div>

            <div className="contact-card">
              <Mail size={34} />

              <h3>Email Us</h3>

              <a href="mailto:baseramitra@gmail.com">
                baseramitra@gmail.com
              </a>
            </div>

            <div className="contact-card">
              <Clock size={34} />

              <h3>Working Hours</h3>

              <p>
                Monday – Saturday
                <br />
                9:00 AM – 6:00 PM
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">

          <h2>Frequently Asked Questions</h2>

          <div className="faq-grid">

            <div className="faq-card">
              <h3>How can I list my property?</h3>

              <p>
                Create an Owner account and add your property from the
                Owner Dashboard.
              </p>
            </div>

            <div className="faq-card">
              <h3>Can I contact property owners?</h3>

              <p>
                Yes. After login, you can send an inquiry directly from
                the Property Details page.
              </p>
            </div>

            <div className="faq-card">
              <h3>Is registration free?</h3>

              <p>
                Yes. Creating an account and browsing properties is
                completely free.
              </p>
            </div>

            <div className="faq-card">
              <h3>Are listings verified?</h3>

              <p>
                We encourage verified listings to provide a safer and
                more reliable property search experience.
              </p>
            </div>

          </div>

        </div>
      </section>

    </section>
  );
};

export default Contact;