const express = require("express");
const {
  createEvent,
  getEvents,
  getEventsByEditor,
  getEvent,
  deleteEvent,
  updateEvent,
} = require("../controllers/eventController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// GET all events
router.get("/", getEvents);

//GET a single event
router.get("/editor", requireAuth, getEventsByEditor);

//GET a single event
router.get("/:id", getEvent);

// require auth for all event routes
router.use(requireAuth);

// POST a new event
router.post("/", createEvent);

// DELETE a event
router.delete("/:id", deleteEvent);

// UPDATE a event
router.patch("/:id", updateEvent);

module.exports = router;
