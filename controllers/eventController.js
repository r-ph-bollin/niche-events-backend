const Event = require("../models/eventModel");
const mongoose = require("mongoose");

// get all events
const getEvents = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.status(200).json(events);
};

const getEventsByEditor = async (req, res) => {
  console.log("hello im here", req.user);
  const user_id = req.user._id;
  console.log({ user_id });
  const events = await Event.find({ user_id }).sort({ createdAt: -1 });
  console.log({ events });

  res.status(200).json(events);
};

// get a single event
const getEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such event" });
  }

  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json({ error: "No such event" });
  }

  res.status(200).json(event);
};

// create new event
const createEvent = async (req, res) => {
  const { title, start_date, end_date, address, description } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!start_date) {
    emptyFields.push("start_date");
  }
  if (!end_date) {
    emptyFields.push("end_date");
  }
  if (!address) {
    emptyFields.push("address");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const event = await Event.create({
      title,
      start_date,
      end_date,
      address,
      description,
      user_id,
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete an event
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such event" });
  }

  const event = await Event.findOneAndDelete({ _id: id });

  if (!event) {
    return res.status(400).json({ error: "No such event" });
  }

  res.status(200).json(event);
};

// update an event
const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such event" });
  }

  const event = await Event.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!event) {
    return res.status(400).json({ error: "No such event" });
  }

  res.status(200).json(event);
};

module.exports = {
  getEvents,
  getEventsByEditor,
  getEvent,
  createEvent,
  deleteEvent,
  updateEvent,
};
