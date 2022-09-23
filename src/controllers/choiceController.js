import database from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

function createChoice(request, response) {
  try {
    const { title, pollId } = response.locals.body;
    const pollsChoices = database.collection(COLLECTIONS.POLLS_CHOICES);

    pollsChoices.insertOne({
      title: title,
      pollId: pollId,
    });

    response.sendStatus(STATUS_CODE.CREATED);
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

function registerChoice(request, response) {
  try {
    const { id } = response.locals.params;
    const choices = database.collection(COLLECTIONS.CHOICES);
    const now = dayjs().format("YYYY-MM-DD HH:mm");

    choices.insertOne({
      createAt: now,
      choiceId: ObjectId(id),
    });

    response.sendStatus(STATUS_CODE.CREATED);
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

export { createChoice, registerChoice };
