const express = require("express");
const router = express.Router();
const {
  createLink,
  getLinks,
  deleteLink,
} = require("../controllers/link.controller.js");

// Route to get all links (with search/filter) and create a new link
router.route("/").get(getLinks).post(createLink);

// Route to delete a specific link
router.route("/:id").delete(deleteLink);

module.exports = router;
