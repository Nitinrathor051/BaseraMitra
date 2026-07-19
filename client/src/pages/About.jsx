import {
  Building2,
  ShieldCheck,
  Users,
  Target,
  Eye,
  BadgeCheck,
} from "lucide-react";

import "../styles/About.css";

const About = () => {
  return (
    <section className="about-page">

      {/* ===========================
          HERO
      =========================== */}

      <section className="about-hero">

        <div className="container about-hero-content">

          <span className="about-hero-badge">
            About BaseraMitra
          </span>

          <h1>
            Making Property Search
            <br />
            Simple, Trusted & Transparent
          </h1>

          <p>
            BaseraMitra helps people discover
            verified properties for buying and
            renting through a clean, secure and
            user-friendly platform.
          </p>

        </div>

      </section>

      {/* ===========================
          WHO WE ARE
      =========================== */}

      <section className="about-section">

        <div className="container">

          <div className="about-section-heading">

            <h2>
              Who We Are
            </h2>

            <p>
              BaseraMitra is a modern real estate
              platform that connects property
              owners with genuine buyers and
              tenants. Our goal is to make
              property discovery simple,
              reliable and hassle-free.
            </p>

          </div>

        </div>

      </section>

      {/* ===========================
          MISSION & VISION
      =========================== */}

      <section className="about-section about-bg-light">

        <div className="container about-mission-grid">

          <div className="about-info-card">

            <Target size={36} />

            <h3>
              Our Mission
            </h3>

            <p>
              To simplify the property buying
              and rental experience by providing
              verified listings and an
              easy-to-use platform.
            </p>

          </div>

          <div className="about-info-card">

            <Eye size={36} />

            <h3>
              Our Vision
            </h3>

            <p>
              To become one of India's most
              trusted real estate platforms
              where every property search is
              fast, transparent and secure.
            </p>

          </div>

        </div>

      </section>

      {/* ===========================
          WHY CHOOSE US
      =========================== */}

      <section className="about-section">

        <div className="container">

          <div className="about-section-heading">

            <h2>
              Why Choose BaseraMitra?
            </h2>

          </div>

          <div className="about-feature-grid">

            <div className="about-feature-card">

              <ShieldCheck size={34} />

              <h3>
                Verified Listings
              </h3>

              <p>
                Browse genuine and trusted
                property listings.
              </p>

            </div>

            <div className="about-feature-card">

              <Users size={34} />

              <h3>
                Direct Owner Connection
              </h3>

              <p>
                Connect directly with owners
                without unnecessary hassle.
              </p>

            </div>
                        <div className="about-feature-card">

              <Building2 size={34} />

              <h3>
                Wide Property Choice
              </h3>

              <p>
                Explore apartments, houses,
                villas and commercial spaces.
              </p>

            </div>

            <div className="about-feature-card">

              <BadgeCheck size={34} />

              <h3>
                Simple Experience
              </h3>

              <p>
                Clean interface designed for
                quick property discovery.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ===========================
          STATS
      =========================== */}

      <section className="about-section about-bg-light">

        <div className="container">

          <div className="about-stats-grid">

            <div>

              <h2>
                500+
              </h2>

              <p>
                Verified Properties
              </p>

            </div>

            <div>

              <h2>
                300+
              </h2>

              <p>
                Happy Customers
              </p>

            </div>

            <div>

              <h2>
                100+
              </h2>

              <p>
                Trusted Owners
              </p>

            </div>

            <div>

              <h2>
                24/7
              </h2>

              <p>
                Customer Support
              </p>

            </div>

          </div>

        </div>

      </section>

    </section>
  );
};

export default About;