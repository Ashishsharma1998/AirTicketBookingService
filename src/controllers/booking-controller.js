const { StatusCodes } = require("http-status-codes");
const bookingService = require("../services/booking-service");

const BookingService = new bookingService();

const create = async (req, res) => {
  try {
    const response = await BookingService.create(req.body);
    return res.status(StatusCodes.OK).json({
      data: response,
      success: true,
      message: "successfully booked a flight",
      err: {},
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      data: {},
      success: false,
      message: error.message,
      err: error.explanation,
    });
  }
};

module.exports = {
  create,
};
