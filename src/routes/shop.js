const express = require('express')
const router = new express.Router()

router.get('/:shopName',async(req,res)=>{
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
    await req.shop.populate({
      path: "products",
      match,
      options:{
        limit,
        skip,
        sort
      }
    }).execPopulate()

    res.send(res.shop.products)
  } catch (e) {
    res.status(500).send()
  }

})


module.exports =router