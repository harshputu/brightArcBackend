const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.submitContactForm = async (req, res) => {
  const { name, email, mobile, source, message } = req.body;

  if (!name || !email || !mobile || !source || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Save to database
    const contact = new Contact({ name, email, mobile, source, message });
    await contact.save();
    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port:587,
      secure:false,
      auth: {
        user: "info@brightarc.in", // brightArc email 
        pass: "kxlsqhjfrknwvzcy", // App password 
      },
      tls:{
        ciphers:'SSLv3'
      }
    });

    const mailToSubmitter = {
  from: "info@brightarc.in",
  to: "info@brightarc.in",
  subject: `New Lead - You have recieved a new form submission from ${name}`,
  html: `
    <p>Hi Admin,</p>
    <p>Below person wants to contact you:</p>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Mobile:</strong> ${mobile}</li>
      <li><strong>Found Us Via:</strong> ${source}</li>
      <li><strong>Message:</strong> ${message}</li>
    </ul>
    <p>Thanking You,<br>
    Team BrightArc</p>
  `
  };

    const mailToCompany = {
      from: "info@brightarc.in",
      to: email,
      subject:`We've recieved your message - Thank You for reaching out!`,
      html: `Hi ${name},<br><br>
    Thank you for getting in touch with us!<br><br>
    We've received your message and our team will get back to you as soon as possible - usually within 24-48 hours. If your inquiry is urgent, feel free to reply to this E-Mail directly.<br>
    <br>Best Regards,<br>
    BrightArc,<br>
    <a href="https://brightArc.in" target="_blank">BrightArc</a>`,
    };

    await transporter.sendMail(mailToSubmitter);
    await transporter.sendMail(mailToCompany);

    res.status(201).json({ message: "Contact form submitted successfully." });
  } catch (error) {
    console.error("Contact submission failed:", error);
    res.status(500).json({ error: "Failed to submit contact form." });
  }
};

exports.getAllContacts = async (req, res) => {
try {
const contacts = await Contact.find().sort({ createdAt: -1 });
res.status(200).json(contacts);
} catch (err) {
res.status(500).json({ error: 'Failed to retrieve contacts.' });
}
};
