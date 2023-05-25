import Joi from "joi";

const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().trim().min(6).max(1024).required(),
  newPassword: Joi.string().trim().min(6).max(1024).required(),
  confirmPassword: Joi.ref("newPassword"),
});

const updatePasswordValidation = ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const { error } = updatePasswordSchema.validate({
    oldPassword,
    newPassword,
    confirmPassword,
  });
  if (error) return { error: error.details[0].message };
  return { error: null };
};

export default updatePasswordValidation;
