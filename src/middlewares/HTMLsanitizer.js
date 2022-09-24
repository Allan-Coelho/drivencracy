import { stripHtml } from "string-strip-html";

const requestObjectsToSanitize = ["headers", "body", "query", "params"];
const propertiesToSanitize = ["pollId", "title", "expireAt", "choiceId", "id"];

function htmlSanitizer(request, response, next) {
  console.log("Sanitize begin");
  for (let j = 0, len0 = requestObjectsToSanitize.length; j < len0; j++) {
    const objectKey = requestObjectsToSanitize[j];
    const object = request?.[objectKey];

    if (!object) {
      continue;
    }

    for (let i = 0, len1 = propertiesToSanitize.length; i < len1; i++) {
      const propertyName = propertiesToSanitize[i];
      const propertyValue = String(object?.[propertyName]);

      if (propertyValue === "undefined" || propertyValue === undefined) {
        continue;
      }

      response.locals[objectKey] = { ...response.locals[objectKey] };
      response.locals[objectKey][propertyName] =
        stripHtml(propertyValue).result;
    }
  }

  next();
}

export { htmlSanitizer };
