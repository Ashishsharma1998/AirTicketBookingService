const { StatusCodes } = require("http-status-codes");
const bookingService = require("../services/booking-service");
const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const BookingService = new bookingService();

class bookingController {
  constructor() {}

  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const payload = {
      data: {
        subject: "This is notification from queue",
        content: "Some queue will subscribe this",
        recepientEmail: "sharmaash234@gmail.com",
        notificationTime: "2023-01-01T10:30:00",
      },
      service: "CREATE_TICKET",
    };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    return res.status(200).json({
      message: "Succesfully published the event",
    });
  }

  async create(req, res) {
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
  }

  async update(req, res) {
    try {
      const response = await BookingService.update(req.params.id, req.body);
      return res.status(StatusCodes.OK).json({
        data: response,
        success: true,
        message: "successfully updated a flight",
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
  }
}

module.exports = bookingController;
