import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().trim().min(6).max(255).required().email(),
  password: Joi.string().trim().min(6).max(1024).required(),
});

const loginValidation = ({ email, password }) => {
  const { error } = loginSchema.validate({ email, password });
  if (error) return { error: error.details[0].message };
  return { error: null };
};

export default loginValidation;
