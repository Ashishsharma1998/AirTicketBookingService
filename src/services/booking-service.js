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

  //data = {noofseats to cancel}
  async update(bookingId, data) {
    try {
      const booking = await this.bookingRepository.get(bookingId);
      const FlightId = booking.flightId;
      const getFlightDetail = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${FlightId}`;
      const response = await axios.get(getFlightDetail);
      const flightData = response.data.data;

      const noOfSeatsToCancel = +data.noOfSeatsToCancel;
      const totalSeats = flightData.totalSeats + noOfSeatsToCancel;
      const updateFlightDetail = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${FlightId}`;
      await axios.patch(updateFlightDetail, { totalSeats: totalSeats });

      if (booking.noOfSeats === noOfSeatsToCancel) {
        const res = await this.bookingRepository.update(bookingId, {
          status: "Cancelled",
        });
        return res;
      }

      const seatsToBook = booking.noOfSeats - noOfSeatsToCancel;
      const newTotalCost = seatsToBook * flightData.price;
      const res = await this.bookingRepository.update(bookingId, {
        noOfSeats: seatsToBook,
        totalCost: newTotalCost,
      });
      return res;
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
