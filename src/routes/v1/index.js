const express = require("express");
const bookingController = require("../../controllers/booking-controller");
const router = express.Router();

const BookingController = new bookingController();

router.post("/bookings", BookingController.create);
router.patch("/bookings/:id", BookingController.update);
router.post("/publish", BookingController.sendMessageToQueue);

module.exports = router;
