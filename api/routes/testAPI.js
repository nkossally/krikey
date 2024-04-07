var express = require("express");
var get_user = require("../datasource");
var { getBook, getSaleItem, getAuthor }  = require("../sqlite")
var router = express.Router();

router.get("/", async (req, res) => {
    try{
        const result = await getSaleItem(2)
        // const result= await getBook(2)
        // const result = await getAuthor(2)

        console.log("result", result)

        res.json(result)
    } catch {

    }

  
});

module.exports = router;
