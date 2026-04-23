import './Home.css';

function Home() {
  return (
    <div className="container">
      <h1>Welcome to Motion Autogarage</h1>
      <h1>Expert Car Repair Services</h1>
      <p>Our expertise spans professional car bodywork, high-quality paint application, and complete vehicle restoration. Learn more about our services, explore automotive insights, and read verified client testimonials below.</p>

      <section>
        <h2>Car Parts Overview</h2>
        <div className="grid">
          <div className="card image-card engine">
            <h3>Engine</h3>
            <p>A car's engine converts fuel into motion through precise combustion, delivering smooth performance, efficiency, and reliability. Designed for strength and innovation, the engine is the heart that keeps your vehicle moving.</p>
          </div>
          <div className="card image-card transmission">
            <h3>Transmission</h3>
            <p>The transmission delivers power from the engine to the wheels, ensuring smooth gear shifts and optimal performance. It balances speed and torque, giving you efficient control and a seamless driving experience.</p>
          </div>
          <div className="card image-card brakes">
            <h3>Brakes</h3>
            <p>The braking system provides safety and control by slowing or stopping the vehicle with precision. It uses hydraulic force to convert pedal pressure into stopping power, ensuring reliable performance in every driving condition.</p>
          </div>
          <div className="card image-card suspension">
            <h3>Suspension</h3>
            <p>The suspension system absorbs shocks and keeps your ride stable and comfortable. It connects the wheels to the vehicle’s frame, ensuring smooth handling, better traction, and control on every road surface.</p>
          </div>
          <div className="card image-card body-panels">
            <h3>Body Panels</h3>
            <p>The body panels shape the vehicle's exterior, providing strength, style, and protection. They enhance aerodynamics, safeguard internal components, and give your car its distinctive look.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Why Choose Motion Auto Garage</h2>
        <div className="grid">
          <div className="card">
            <h3>Expert Technicians</h3>
            <p>Our team consists of highly trained and certified automotive engineers with years of experience in vehicle repairs, diagnostics, and restoration. We stay updated with the latest automotive technology and repair techniques.</p>
          </div>
          <div className="card">
            <h3>Quality Workmanship</h3>
            <p>We use premium parts and cutting-edge diagnostic equipment to ensure your vehicle receives the highest quality service. Every repair undergoes strict quality checks before handover to guarantee your satisfaction.</p>
          </div>
          <div className="card">
            <h3>Comprehensive Services</h3>
            <p>From routine maintenance to complex engine overhauls, collision repairs to custom fabrication, we handle all automotive needs. Whether it's bodywork, electrical systems, or suspension, we have the expertise and equipment.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Car Maintenance Tips</h2>
        <div className="grid">
          <div className="card">
            <h3>Regular Oil Changes</h3>
            <p>Change your engine oil every 3,000-5,000 miles (or as recommended by your vehicle's manufacturer). Fresh oil keeps your engine lubricated, prevents wear, and maintains optimal performance and fuel efficiency.</p>
          </div>
          <div className="card">
            <h3>Tire Maintenance</h3>
            <p>Check tire pressure monthly and rotate tires every 5,000-7,000 miles. Proper tire maintenance extends tire life, improves fuel economy, ensures safe handling, and reduces the risk of blowouts.</p>
          </div>
          <div className="card">
            <h3>Brake System Care</h3>
            <p>Have your brakes inspected regularly and replace brake pads before they wear completely. A well-maintained brake system ensures your safety and prevents expensive damage to rotors and other brake components.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;