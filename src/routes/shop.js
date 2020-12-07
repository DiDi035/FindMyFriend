const Shop = require("../database/models/Shop");
const requireLogin = require("../middleware/RequiredLogin");

const express = require("express");
const Product = require("../database/models/Product");

const router = new express.Router();

router.get("/:shopName", async (req, res) => {
  const match = {};
  const limit = 10;
  const skip = 0;
  const sort = {};

  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }

  if (req.query.skip) {
    limit = parseInt(req.query.skip);
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = part[1] === "desc" ? -1 : 1;
  }
  try {
    await req.shop
      .populate({
        path: "products",
        match,
        options: {
          limit,
          skip,
          sort,
        },    
      })
      .execPopulate();

    res.send(res.shop.products);
  } catch (e) {
    res.status(500).send();
  }
});

//add products
router.post("/:shopName/addProduct",requireLogin, async (req, res) => {
  const product = new Product({
    ...req.body,
    owner: req.session.user_id
  })
  try{
    await product.save()
    res.status(201).send()
  }catch(e){
    res.status(500).send(e)
  }
});

router.get("/:shopName/",async(req,res)=>{
  
})

module.exports = router;
