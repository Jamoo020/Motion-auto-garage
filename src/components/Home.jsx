import './Home.css';

function Home() {
  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Motion Auto Garage</h1>
        <h2 className="hero-subtitle">Expert Car Repair Services</h2>
        <p className="hero-description">
          Our expertise spans professional car bodywork, high-quality paint application, and complete vehicle restoration.
          Learn more about our services and automotive insights.
        </p>
      </div>

      <section className="features-section">
        <h2 className="section-title">Why Choose Motion Auto Garage</h2>
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">🔧</div>
            <h3>Expert Technicians</h3>
            <p>Our team consists of highly trained and certified automotive engineers with years of experience in vehicle repairs, diagnostics, and restoration.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⭐</div>
            <h3>Quality Workmanship</h3>
            <p>We use premium parts and cutting-edge diagnostic equipment to ensure your vehicle receives the highest quality service.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🚗</div>
            <h3>Comprehensive Services</h3>
            <p>From routine maintenance to complex engine overhauls, collision repairs to custom fabrication, we handle all automotive needs.</p>
          </div>
        </div>
      </section>

      <section className="tips-section">
        <h2 className="section-title">Car Maintenance Tips</h2>
        <div className="tips-content">
          <div className="tip-item">
            <h3>Regular Oil Changes</h3>
            <p>Change your engine oil every 3,000-5,000 miles (or as recommended by your vehicle's manufacturer). Fresh oil keeps your engine lubricated, prevents wear, and maintains optimal performance and fuel efficiency.</p>
          </div>
          <div className="tip-item">
            <h3>Tire Maintenance</h3>
            <p>Check tire pressure monthly and rotate tires every 5,000-7,000 miles. Proper tire maintenance extends tire life, improves fuel economy, ensures safe handling, and reduces the risk of blowouts.</p>
          </div>
          <div className="tip-item">
            <h3>Brake System Care</h3>
            <p>Have your brakes inspected regularly and replace brake pads before they wear completely. A well-maintained brake system ensures your safety and prevents expensive damage to rotors and other brake components.</p>
          </div>
        </div>
      </section>

      <section className="parts-section">
        <h2 className="section-title">Car Parts Overview</h2>
        <div className="parts-showcase">
          <div className="part-highlight">
            <span className="part-emoji">⚙️</span>
            <h3>Engine</h3>
            <p>The heart that keeps your vehicle moving with precision and power.</p>
          </div>
          <div className="part-highlight">
            <span className="part-emoji">🔄</span>
            <h3>Transmission</h3>
            <p>Delivers power from engine to wheels for smooth, efficient performance.</p>
          </div>
          <div className="part-highlight">
            <span className="part-emoji">🛑</span>
            <h3>Brakes</h3>
            <p>Provides safety and control with reliable stopping power.</p>
          </div>
          <div className="part-highlight">
            <span className="part-emoji">🌀</span>
            <h3>Suspension</h3>
            <p>Absorbs shocks for stable, comfortable rides on any surface.</p>
          </div>
          <div className="part-highlight">
            <span className="part-emoji">🚗</span>
            <h3>Body Panels</h3>
            <p>Shapes your vehicle's exterior with strength, style, and protection.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;