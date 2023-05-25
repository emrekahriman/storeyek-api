import { sendContactForm, getFaqs, createFaq, getPageWithSlug, createPage } from "../controllers/page.js";
import express from "express";
const router = express.Router();

router.post("/contact", sendContactForm);

router.get("/faq", getFaqs);
router.post("/faq/create", createFaq);

router.get("/:slug", getPageWithSlug);
router.post("/create", createPage);


export default router;
