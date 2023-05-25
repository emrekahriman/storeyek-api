import Joi from "joi";

const resetPasswordSchema = Joi.object({
  password: Joi.string().trim().min(6).max(1024).required(),
});

const resetPasswordValidation = ({ password }) => {
  const { error } = resetPasswordSchema.validate({ password });
  if (error) return { error: error.details[0].message };
  return { error: null };
};

export default resetPasswordValidation;
