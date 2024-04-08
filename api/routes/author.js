var express = require("express");
var { getAuthor } = require("../sqlite");

var router = express.Router();

router.get("/", async (req, res) => {
  const name = req.query["name"];
  try {
    const result = await getAuthor(name);
    if(result === undefined){
        res.status(404).send({ error: "Author not found" });
    } else {
        res.json(result);
    }
  } catch {}
});

module.exports = router;
