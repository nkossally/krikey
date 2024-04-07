var express = require("express");
var { getBook, getSaleItem, getAuthor, getTenOldelstAuthors, getTopSellingAuthors, getAuthorSalesTotal }  = require("../sqlite")
var router = express.Router();

router.get("/", async (req, res) => {
    try{
        const result = await getTopSellingAuthors();

        res.json(result)
    } catch {

    }

  
});

module.exports = router;
