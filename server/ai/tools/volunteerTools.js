const Volunteer = require("../../models/Volunteer");

const getVolunteers = async ({
  availability,
  status,
} = {}) => {
  const filter = {};

  if (availability) {
    filter.availability = availability;
  }

  if (status) {
    filter.status = status;
  }

  const volunteers =
    await Volunteer.find(filter)
      .sort({ name: 1 });

  return volunteers;
};

const getAvailableVolunteers = async () => {
  const volunteers =
    await Volunteer.find({
      availability: "Available",
      status: "Active",
    }).sort({ name: 1 });

  return volunteers;
};

module.exports = {
  getVolunteers,
  getAvailableVolunteers,
};