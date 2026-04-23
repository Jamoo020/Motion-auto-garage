import { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Contacts.css';

function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    enableBooking: false
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // EmailJS configuration - you'll need to set these up in EmailJS dashboard
      const serviceId = 'your_service_id'; // Replace with your EmailJS service ID
      const templateId = 'your_template_id'; // Replace with your EmailJS template ID
      const publicKey = 'your_public_key'; // Replace with your EmailJS public key

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'info@automotion.co.ke',
        form_type: formData.enableBooking ? 'Appointment Request' : 'Contact Message',
        phone: formData.phone || 'Not provided',
        service: formData.service || 'Not specified',
        preferred_date: formData.date || 'Not specified',
        preferred_time: formData.time || 'Not specified',
        notes: formData.notes || 'None'
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        message: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        notes: '',
        enableBooking: false
      });
    } catch (error) {
      console.error('EmailJS error:', error);
      setMessage('Sorry, there was an error sending your message. Please try again or contact us directly at info@automotion.co.ke');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you. Use the form below to send a message or tick the booking option to request an appointment.</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" name="name" required placeholder="Your name" value={formData.name} onChange={handleChange} />

        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="4" placeholder="Type your message here..." value={formData.message} onChange={handleChange}></textarea>

        <div style={{ margin: '12px 0' }}>
          <label>
            <input type="checkbox" id="enableBooking" name="enableBooking" checked={formData.enableBooking} onChange={handleChange} /> I want to book an appointment
          </label>
        </div>

        {formData.enableBooking && (
          <div style={{ borderLeft: '3px solid rgba(43,155,255,0.12)', paddingLeft: '12px', marginBottom: '12px' }}>
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" placeholder="+2547XXXXXXXX" value={formData.phone} onChange={handleChange} />

            <label htmlFor="service">Service</label>
            <select id="service" name="service" value={formData.service} onChange={handleChange}>
              <option value="">-- Select a service --</option>
              <option value="Collision &amp; accident repairs">Collision &amp; accident repairs</option>
              <option value="Dent removal &amp; panel beating">Dent removal &amp; panel beating</option>
              <option value="Car respray &amp; paint restoration">Car respray &amp; paint restoration</option>
              <option value="Scratch repair &amp; detailing">Scratch repair &amp; detailing</option>
              <option value="Frame alignment &amp; replacement parts">Frame alignment &amp; replacement parts</option>
              <option value="General inspection & maintenance">General inspection & maintenance</option>
            </select>

            <label htmlFor="date">Preferred Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />

            <label htmlFor="time">Preferred Time</label>
            <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} />

            <label htmlFor="notes">Notes (optional)</label>
            <textarea id="notes" name="notes" rows="3" placeholder="Vehicle model, additional details..." value={formData.notes} onChange={handleChange}></textarea>
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div id="formMessage" style={{
        marginTop: '12px',
        color: message.includes('error') || message.includes('Error') ? '#ff6b6b' : '#4ecdc4',
        fontWeight: '500'
      }}>
        {message}
      </div>

      <div className="contact-info" style={{ marginTop: '18px' }}>
        <p><strong>Call us on:</strong>
          <a href="tel:+254722369689">+2547 22 369689</a> or
          <a href="tel:+254793853771">+2547 93 853 771</a>
        </p>
        <p><strong>Email us at:</strong>
          <a href="mailto:info@automotion.co.ke">info@automotion.co.ke</a>
        </p>
      </div>
    </div>
  );
}

export default Contacts;