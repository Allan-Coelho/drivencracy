import database from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";

function createChoice(request, response) {
  const { title, pollId } = response.locals.body;
  const polls = database.collection(COLLECTIONS.POLLS);

  polls.insertOne({
    title: title,
    pollId: pollId,
  });

  response.sendStatus(STATUS_CODE.CREATED);
}

export {createChoice}
