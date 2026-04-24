# EmailJS Setup Guide

## Setting up Email Sending for the Contact Form

The contact form now uses EmailJS to send emails directly to `info@motion-auto.co.ke` without needing a PHP backend.

### Steps to Set Up EmailJS:

1. **Create an EmailJS Account:**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account

2. **Set Up Email Service:**
   - In your EmailJS dashboard, go to "Email Services"
   - Add a new service (Gmail, Outlook, etc.)
   - Connect your email account that will send the messages

3. **Create an Email Template:**
   - Go to "Email Templates"
   - Create a new template with these variables:
     ```
     Subject: {{form_type}} from {{from_name}}

     Name: {{from_name}}
     Email: {{from_email}}
     Message: {{message}}

     {{#if phone}}
     Phone: {{phone}}
     {{/if}}

     {{#if service}}
     Service: {{service}}
     Preferred Date: {{preferred_date}}
     Preferred Time: {{preferred_time}}
     Notes: {{notes}}
     {{/if}}
     ```

4. **Get Your Keys:**
   - Service ID: Found in Email Services
   - Template ID: Found in Email Templates
   - Public Key: Found in Account settings

5. **Update the Code:**
   - In `src/components/Contacts.jsx`, replace:
     ```javascript
     const serviceId = 'your_service_id';     // ← Replace with your Service ID
     const templateId = 'your_template_id';   // ← Replace with your Template ID
     const publicKey = 'your_public_key';     // ← Replace with your Public Key
     ```

6. **Test the Form:**
   - The form will now send emails directly to `info@motion-auto.co.ke`
   - Test with the contact form on your website

### Benefits:
- ✅ No PHP backend needed
- ✅ Emails sent directly from the browser
- ✅ Works with any hosting provider
- ✅ Free tier available
- ✅ Secure (no email credentials in code)

### Troubleshooting:
- Make sure your EmailJS account is verified
- Check the browser console for any errors
- Ensure the template variables match exactly