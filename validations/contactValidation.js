import Joi from "joi";

const contactSchema = Joi.object({
  fullName: Joi.string().trim().min(5).max(30).required(),
  subject: Joi.string().trim().min(5).max(100).required(),
  email: Joi.string().trim().min(6).max(255).required().email(),
  message: Joi.string().trim().min(20).max(1024).required(),
});

const contactValidation = ({ fullName, subject, email, message }) => {
  const { error } = contactSchema.validate({
    fullName,
    subject,
    email,
    message,
  });
  if (error) return { error: error.details[0].message };
  return { error: null };
};

export default contactValidation;
