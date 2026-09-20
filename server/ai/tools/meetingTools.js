const Meeting = require("../../models/Meeting");

const getMeetings = async ({
  status,
} = {}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  const meetings =
    await Meeting.find(filter)
      .populate("eventId", "title date")
      .sort({ date: 1 });

  return meetings;
};

const getUpcomingMeetings = async ({
  days = 30,
} = {}) => {
  const now = new Date();

  const endDate = new Date();
  endDate.setDate(
    endDate.getDate() + Number(days)
  );

  const meetings =
    await Meeting.find({
      date: {
        $gte: now,
        $lte: endDate,
      },
      status: {
        $ne: "Cancelled",
      },
    })
      .populate(
        "eventId",
        "title date"
      )
      .sort({ date: 1 });

  return meetings;
};

module.exports = {
  getMeetings,
  getUpcomingMeetings,
};