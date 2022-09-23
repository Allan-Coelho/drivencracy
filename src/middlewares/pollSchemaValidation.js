import database from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import { choiceSchema, choiceIdSchema } from "../schemas/choiceSchema.js";

async function pollCreationValidation(request, response, next) {
  try {
    const body = response.locals.body;
    const polls = database.collection(COLLECTIONS.POLLS);
    const { error, value } = choiceSchema.validate(body);
    const { expireAt, title } = value;
    const titleAlreadyExist =
      (await polls.findOne({ title: new RegExp(`/^${title}$/i`) })) === null
        ? false
        : true;

    if (error !== undefined) {
      response
        .status(STATUS_CODE.UNPROCESSABLE_ENTITY)
        .send("unprocessable body request");
      return;
    }

    if (titleAlreadyExist) {
      response.sendStatus(STATUS_CODE.CONFLICT);
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

async function choiceSelectionValidation(request, response, next) {
  try {
    const now = Date.now();
    const { id } = response.locals.params;
    const { value, error } = choiceIdSchema.validate(id);
    const poll = await polls.findOne({ pollId: value });

    if (error !== undefined) {
      response.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send("invalid poll id");
      return;
    }

    if (poll === null) {
      response.status(STATUS_CODE.NOT_FOUND).send("poll not found");
      return;
    }

    if (new Date(poll.expireAt).getMilliseconds() < now) {
      response.sendStatus(STATUS_CODE.FORBIDDEN);
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

export { pollCreationValidation, choiceSelectionValidation };
