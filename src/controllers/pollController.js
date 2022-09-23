import database from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import dayjs from "dayjs";
import { MINUTES } from "../enums/time.js";
import { ObjectId } from "mongodb";

function createPoll(request, response) {
  try {
    const willExpireAt = Date.now() + MINUTES.DAYS_30;
    const { expireAt, title } = response.locals.body;
    const polls = database.collection(COLLECTIONS.POLLS);

    if (expireAt === undefined || expireAt === null || expireAt === "") {
      expireAt = dayjs(willExpireAt).format("YYYY-MM-DD HH:mm");
    }

    polls.insertOne({
      title: title,
      expireAt: willExpireAt,
    });

    response.sendStatus(STATUS_CODE.CREATED);
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

async function allPolls(request, response) {
  try {
    const polls = await database
      .collection(COLLECTIONS.POLLS)
      .find({})
      .toArray();

    response.send(polls);
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

async function getPollChoices(request, response) {
  try {
    const { id } = response.locals.param;
    const pollsChoices = database.collection(COLLECTIONS.POLLS_CHOICES);
    const pollChoices = await pollsChoices
      .find({ _id: ObjectId(id) })
      .toArray();

    response.send(pollChoices);
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

async function getPollResult(request, response) {
  try {
    const { id } = response.locals.param;
    const pollsChoices = database.collection(COLLECTIONS.CHOICES);
    const polls = database.collection(COLLECTIONS.POLLS);
    const poll = await polls.findOne({ _id: ObjectId(id) });
    const pollChoices = await pollsChoices
      .find({ pollId: ObjectId(id) })
      .toArray();
    const mostVoted = {
      title: pollChoices[0],
      votesCounter: 1,
    };

    if (poll === null) {
      response.sendStatus(STATUS_CODE.NOT_FOUND);
      return;
    }

    for (let i = 0, len0 = pollChoices.length; i < len0; i++) {
      let counter = 0;
      let title = pollChoices[i].title;

      for (let j = 0, len1 = pollChoices.length; j < len1; j++) {
        if (pollChoices[j].title === title) {
          counter += 1;
        }
      }

      if (mostVoted.votesCounter < counter) {
        mostVoted.title = title;
        mostVoted.votesCounter = counter;
      }
    }

    response.send({
      _id: id,
      title: mostVoted.title,
      expireAt: "2022-02-14 01:00",
      result: {
        title: "Javascript",
        votes: 487,
      },
    });
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}
export { createPoll, allPolls, getPollChoices, getPollResult };
