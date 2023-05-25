import Joi from "joi";

const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(5).max(30).required(),
  phone: Joi.string().trim().min(10).max(10).required(),
  address: Joi.string().trim().min(20).max(255).required(),
});

const updateProfileValidation = ({ fullName, phone, address }) => {
  const { error } = updateProfileSchema.validate({
    fullName,
    phone,
    address,
  });
  if (error) return { error: error.details[0].message };
  return { error: null };
};

export default updateProfileValidation;
