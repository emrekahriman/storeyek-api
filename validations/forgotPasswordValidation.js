import Joi from "joi";

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().min(6).max(255).required().email(),
});

const forgotPasswordValidation = ({ email }) => {
  const { error } = forgotPasswordSchema.validate({ email });
  if (error) return { error: error.details[0].message };
  return { error: null };
};

export default forgotPasswordValidation;
