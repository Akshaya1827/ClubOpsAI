const Event = require("../../models/Event");

const getEvents = async ({ status } = {}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  const events = await Event.find(filter)
    .sort({ date: 1 });

  return events;
};

const getUpcomingEvents = async ({ days = 30 } = {}) => {
  const now = new Date();

  const endDate = new Date();
  endDate.setDate(
    endDate.getDate() + Number(days)
  );

  const events = await Event.find({
    date: {
      $gte: now,
      $lte: endDate,
    },
    status: {
      $ne: "cancelled",
    },
  }).sort({ date: 1 });

  return events;
};

module.exports = {
  getEvents,
  getUpcomingEvents,
};