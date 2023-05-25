import Page from "../models/PageModel.js";
import Faq from "../models/FaqModel.js";
import Contact from "../models/ContactModel.js";
import contactValidation from "../validations/contactValidation.js";
import sendEmail from "../utils/sendEmail.js";

export const sendContactForm = async (req, res) => {
  try {
    const { fullName, subject, email, message } = req.body;

    // validate form data
    const { error } = contactValidation({ fullName, subject, email, message });
    if (error) return res.send({ status: "error", error });

    // create new contact
    const contactForm = await Contact.create({
      fullName,
      subject,
      email,
      message,
    });

    // send email to admin
    const { error: sendMailError } = await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: "New Contact Form",
      mailType: "contactForm",
      data: {
        fullName,
        subject,
        email,
        message,
      },
    });
    if (sendMailError)
      return res.send({ status: "error", error: sendMailError });

    return res.send({ status: "success", contactForm });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({});
    if (!faqs) return res.send({ status: "error", error: "FAQs not found" });

    return res.send({ status: "success", faqs });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer)
      return res.send({ status: "error", error: "Invalid form data" });

    const faq = new Faq({
      question,
      answer,
    });

    await faq.save();

    return res.send({ status: "success", faq });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const getPageWithSlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.send({ status: "error", error: "Page not found" });

    return res.send({ status: "success", page });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const createPage = async (req, res) => {
  try {
    const { title, slug, image, content } = req.body;

    if (!title || !image || !content)
      return res.send({ status: "error", error: "Invalid form data" });

    const page = new Page({
      title,
      slug,
      image,
      content,
    });

    await page.save();

    return res.send({ status: "success", page });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};
