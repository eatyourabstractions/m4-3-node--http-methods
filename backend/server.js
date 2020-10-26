"use strict";
const bodyParser = require("body-parser");
// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const { stock, customers } = require("./data/inventory");

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇
  .post('/order',(req, res) =>{
    
    const name = req.body.givenName.toLowerCase();
    const email = req.body.email.toLowerCase();
    const address = req.body.address.toLowerCase();
    const order = req.body.order;
    const size = req.body.size;
    
    
    const country = req.body.country.toLowerCase();
    let isInCanada = country === 'canada';
    let hasOrdered = false;
    for(let idx = 0; idx < customers.length; idx++){
      let cx = customers[idx];
      if(cx.givenName.toLowerCase() === name || cx.email.toLowerCase() === email|| cx.address.toLowerCase() === address){
        hasOrdered = true;
        break;
      }
    }
    const validateEmail = (e) => e.includes("@")
    const verifyStock = (item, measurements) =>{
      if(measurements === undefined){
        return stock[item] !== "0"
      } else {
        return stock[item][measurements] !== "0"
      }
    }
    if(!verifyStock(order, size)){
      res.json({ status: "error", error: "unavailable"})
    } else if(hasOrdered){
      res.json({ status: "error", error: "repeat-customer"})
    } else if(!isInCanada){
      res.json({ status: "error", error: "undeliverable"})
    } else if(!validateEmail(email)){
      res.json({ status: "error", error: "missing-data"})
    } else{
      res.json({status: "success", ...req.body})
    }
    
    
  })

  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
