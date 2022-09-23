import Joi from "joi";

const pollSchema = Joi.object({
  title: Joi.string().min(1).required(),
  expireAt: Joi.date(),
});

export { pollSchema };
