import database from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import { choiceSchema, choiceIdSchema } from "../schemas/choiceSchema.js";
import { ObjectId } from "mongodb";

async function choiceSchemaValidation(request, response, next) {
  try {
    const now = Date.now();
    const body = response.locals.body;
    const polls = database.collection(COLLECTIONS.POLLS);
    const choices = database.collection(COLLECTIONS.POLLS_CHOICES);
    const { error, value } = choiceSchema.validate(body);
    const { pollId, title } = value;

    if (error !== undefined) {
      console.log(error);
      response
        .status(STATUS_CODE.UNPROCESSABLE_ENTITY)
        .send("unprocessable body request");
      return;
    }

    const poll = await polls.findOne({ _id: ObjectId(pollId) });
    const titleAlreadyExist =
      (await choices.findOne({ title: title })) === null ? false : true;

    if (poll === null) {
      response.status(STATUS_CODE.NOT_FOUND).send("poll not found");
      return;
    }

    if (titleAlreadyExist) {
      response.sendStatus(STATUS_CODE.CONFLICT);
      return;
    }

    if (Date.parse(poll.expireAt) < now) {
      response.sendStatus(STATUS_CODE.FORBIDDEN);
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
    const pollsChoices = database.collection(COLLECTIONS.POLLS_CHOICES);
    const polls = database.collection(COLLECTIONS.POLLS);

    if (error !== undefined) {
      response.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send("invalid poll id");
      return;
    }
    console.log("chegou")
    const pollChoice = await pollsChoices.findOne({ _id: ObjectId(value) });

    if (pollChoice === null) {
      response.status(STATUS_CODE.NOT_FOUND).send("choice not found");
      return;
    }

    const poll = await polls.findOne({ _id: ObjectId(pollChoice.pollId) });

    if (poll === null) {
      response.status(STATUS_CODE.NOT_FOUND).send("poll not found");
      return;
    }

    if (Date.parse(poll.expireAt) < now) {
      response.sendStatus(STATUS_CODE.FORBIDDEN);
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

export { choiceSchemaValidation, choiceSelectionValidation };
