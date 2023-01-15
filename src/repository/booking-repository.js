const { validationError, appError } = require("../utils/errors/index");
const { Booking } = require("../models/index");
const { StatusCodes } = require("http-status-codes");

class bookingRepository {
  async create(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        throw new validationError(error);
      }
      throw new appError(
        "repositoryError",
        "Cannot create booking",
        "There is some server issue while creating booking, try again later",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(bookingId, data) {
    try {
      const response = await Booking.findByPk(bookingId);
      if (data.status) {
        response.status = data.status;
      }
      if (data.noOfSeats) {
        response.noOfSeats = data.noOfSeats;
      }
      if (data.totalCost) {
        response.totalCost = data.totalCost;
      }
      await response.save();
      return response;
    } catch (error) {
      throw new appError(
        "repositoryError",
        "cannot update booking",
        "There is some error while booking,Please try again later",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async get(bookingId) {
    try {
      const response = await Booking.findByPk(bookingId);
      return response;
    } catch (error) {
      throw new appError(
        "repositoryError",
        "cannot get booking",
        "There is some error while fetching booking,Please try again later",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = bookingRepository;
