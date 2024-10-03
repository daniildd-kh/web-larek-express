import { celebrate, Joi, errors, Segments } from "celebrate";

const orderValidationSchema = Joi.object({
  items: Joi.array().items(Joi.string().required()).min(1).required(),
  total: Joi.number().integer().required(),
  payment: Joi.string().valid("card", "online").required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    .required(),
  address: Joi.string().required(),
});

const productValidationSchema = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required()
  }),
  category:Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().allow(null)
})

export const validateOrderBody = celebrate({
  [Segments.BODY]: orderValidationSchema,
});

export const validateProductBody = celebrate({
  [Segments.BODY]: productValidationSchema,
});
