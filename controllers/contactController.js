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
      service: "gmail",
      auth: {
        user: "putuharsh@gmail.com", // Replace with brightArc email whatever it will be
        pass: "", // App password (not regular Gmail password) in case of gmail
      },
    });

    const mailToSubmitter = {
      from: "putuharsh@gmail.com",
      to: "rackr7642@gmail.com",
      subject: `New Lead - You have recieved a new form submission from ${name}`,
      text: `Hi Admin,\n\n\nBelow person want to contact you\nName: ${name}\n
  Email: ${email}\n
  Mobile: ${mobile}\n
  Found Us Via: ${source}\n
  Message: ${message}\n
  \n\nThanking You,
  \nTeam BrightArc`,
    };

    const mailToCompany = {
      from: "putuharsh@gmail.com",
      to: "harshputu@gmail.com",
      subject:`We've recieved your message - Thank You for reaching out!`,
      text: `Hi ${name},\n\n\nThank you for getting in touch with us!\n\n\nWe've received your message and our team will get back to you as soon as possible - usually within 24-48 hours. If your inquiry is urgent, feel free to reply to this E-Mail directly.
  \n\n\nBest Regards,
  \nBrightArc,
  \nbrightarcURL`,
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
