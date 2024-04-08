var express = require("express");
var { getTopSellingAuthors } = require("../sqlite");
var router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await getTopSellingAuthors();
    res.json(result);
  } catch {}
});

module.exports = router;
