const bookingRepository = require("../repository/booking-repository");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const axios = require("axios");
const { serviceError } = require("../utils/errors/index");

class bookingService {
  constructor() {
    this.bookingRepository = new bookingRepository();
  }

  async create(data) {
    try {
      const FlightId = data.flightId;
      const getFlightDetail = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${FlightId}`;
      const response = await axios.get(getFlightDetail);
      const flightData = response.data.data;
      if (data.noOfSeats > flightData.totalSeats) {
        throw new serviceError(
          "Something went wrong in the booking process",
          "seats are not available to book"
        );
      }
      const totalCost = data.noOfSeats * flightData.price;
      const availableSeats = flightData.totalSeats - data.noOfSeats;
      const booking = await this.bookingRepository.create({
        ...data,
        totalCost,
      });
      const updateFlightDetail = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
      console.log(updateFlightDetail);
      await axios.patch(updateFlightDetail, { totalSeats: availableSeats });
      const finalBooking = await this.bookingRepository.update(booking.id, {
        status: "Booked",
      });
      return finalBooking;
    } catch (error) {
      if (
        error.name === "repositoryError" ||
        error.name === "validationError"
      ) {
        throw error;
      }
      throw new serviceError();
    }
  }
}

module.exports = bookingService;
