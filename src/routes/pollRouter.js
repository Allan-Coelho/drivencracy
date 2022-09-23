import express from "express";
import { htmlSanitizer } from "../middlewares/HTMLsanitizer.js";

const router = express.Router();

router.post("/poll", htmlSanitizer, postProduct);
router.get("/poll", htmlSanitizer, postProduct);
router.get("/poll/:id/choice", htmlSanitizer, postProduct);
router.get("/poll/:id/result", htmlSanitizer, postProduct);

export default router;
