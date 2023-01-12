const express = require("express");
const router = exprees.Router();

const v1ApiRoutes = require("./v1/index");

router.use("/v1", v1ApiRoutes);

module.exports = router;
