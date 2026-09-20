const Announcement = require("../../models/Announcement");

const getAnnouncements = async ({
  status,
} = {}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  const announcements =
    await Announcement.find(filter)
      .populate(
        "eventId",
        "title date"
      )
      .sort({ createdAt: -1 });

  return announcements;
};

const getPublishedAnnouncements =
  async () => {
    const announcements =
      await Announcement.find({
        status: "Published",
      })
        .populate(
          "eventId",
          "title date"
        )
        .sort({ publishedAt: -1 });

    return announcements;
  };

module.exports = {
  getAnnouncements,
  getPublishedAnnouncements,
};