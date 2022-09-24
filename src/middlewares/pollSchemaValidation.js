import database from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import { pollSchema } from "../schemas/pollSchema.js";

async function pollCreationValidation(request, response, next) {
  try {
    const body = response.locals.body;
    const polls = database.collection(COLLECTIONS.POLLS);
    const { error, value } = pollSchema.validate(body);
    const { expireAt, title } = value;
    const titleAlreadyExist =
      (await polls.findOne({ title: title })) === null ? false : true;

    if (error !== undefined) {
      console.log(error);
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

export { pollCreationValidation };
