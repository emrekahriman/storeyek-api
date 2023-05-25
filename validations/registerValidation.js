import Joi from "joi";

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(5).max(30).required(),
  phone: Joi.string().trim().min(10).max(10).required(),
  email: Joi.string().trim().min(6).max(255).required().email(),
  password: Joi.string().trim().min(6).max(1024).required(),
  confirmPassword: Joi.ref("password"),
});

const registerValidation = ({
  fullName,
  phone,
  email,
  password,
  confirmPassword,
}) => {
  const { error } = registerSchema.validate({
    fullName,
    phone,
    email,
    password,
    confirmPassword,
  });
  if (error) return { error: error.details[0].message };
  return { error: null };
};

export default registerValidation;
