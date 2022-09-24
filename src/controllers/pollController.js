import database from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { COLLECTIONS } from "../enums/collections.js";
import dayjs from "dayjs";
import { MINUTES } from "../enums/time.js";
import { ObjectId } from "mongodb";

function createPoll(request, response) {
  try {
    const willExpireAt = Date.now() + MINUTES.DAYS_30;
    let { expireAt, title } = response.locals.body;
    const polls = database.collection(COLLECTIONS.POLLS);

    if (expireAt === undefined || expireAt === null || expireAt === "") {
      expireAt = dayjs(willExpireAt).format("YYYY-MM-DD HH:mm");
    }

    polls
      .insertOne({
        title: title,
        expireAt: dayjs(expireAt).format("YYYY-MM-DD HH:mm"),
      })
      .then((insertionData) => {
        response.status(STATUS_CODE.CREATED).send({
          _id: insertionData.insertedId,
          title: title,
          expireAt: dayjs(expireAt).format("YYYY-MM-DD HH:mm"),
        });
      });
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
    const { id } = response.locals.params;
    const pollsChoices = database.collection(COLLECTIONS.POLLS_CHOICES);
    const polls = database.collection(COLLECTIONS.POLLS);
    const isPollCreated =
      (await polls.findOne({ _id: ObjectId(id) })) !== null ? true : false;
    const pollChoices = await pollsChoices
      .find({ pollId: ObjectId(id) })
      .toArray();

    if (isPollCreated === false) {
      response.sendStatus(STATUS_CODE.NOT_FOUND);
      return;
    }

    response.send(pollChoices);
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}

async function getPollResult(request, response) {
  try {
    const { id } = response.locals.params;
    const pollsChoices = database.collection(COLLECTIONS.POLLS_CHOICES);
    const polls = database.collection(COLLECTIONS.POLLS);
    const choices = database.collection(COLLECTIONS.CHOICES);
    const poll = await polls.findOne({ _id: ObjectId(id) });
    const ranking = [];
    const pollChoices = await pollsChoices
      .find({ pollId: ObjectId(id) })
      .toArray();

    if (poll === null) {
      response.sendStatus(STATUS_CODE.NOT_FOUND);
      return;
    }

    for (let i = 0, len0 = pollChoices.length; i < len0; i++) {
      let pollChoice = pollChoices[i];

      const votes = await choices
        .find({ choiceId: ObjectId(pollChoice._id) })
        .toArray();

      ranking.push({
        title: pollChoice.title,
        votes: votes.length,
      });
    }

    ranking.sort((a, b) => {
      return a.votes - b.votes;
    });

    ranking.reverse();

    response.send({
      _id: id,
      title: poll.title,
      expireAt: poll.expireAt,
      result: {
        title: ranking[0].title,
        votes: ranking[0].votes,
      },
    });
  } catch (err) {
    console.log(err);
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
}
export { createPoll, allPolls, getPollChoices, getPollResult };
