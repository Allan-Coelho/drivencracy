import Joi from "joi";

const choiceSchema = Joi.object({
  title: Joi.string().min(1).required(),
  pollId: Joi.string().length(24).required(),
});

const choiceIdSchema = Joi.string().length(24).required();

export { choiceSchema, choiceIdSchema };
