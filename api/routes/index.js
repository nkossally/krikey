var express = require("express");
var { buildDatabase } = require("../sqlite");
var router = express.Router();

/*  */
router.get("/", function (req, res, next) {
  try {
    buildDatabase();
  } catch {}
});

module.exports = router;
