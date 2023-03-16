import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
// const express = require("express");
import express from "express";
import { MongoClient } from "mongodb";
const app = express();
const MONGO_URL=process.env.MONGO_URL;
const PORT = process.env.PORT;
// const PORT=4000;
// const MONGO_URL = "mongodb://127.0.0.1";

const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

// const cart=[
//   {
//     "id": "1",
//     "image": "/images/jcb.jpg",
//     "name": "JCB",
//     "price": 200,
//     "status": "false"
//   },
//   {
//     "id": "2",
//     "image": "/images/ciment mixture.jpg",
//     "name": "Cement mixture",
//     "price": 175,
//     "status": "true"
//   },
//   {
//     "id": "3",
//     "image": "/images/road_roller.jpg",
//     "name": "Road roller",
//     "price": 180,
//     "status": "false"
//   },
//   {
//     "id": "4",
//     "image":
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSHKPiMxlEfAcUa_CFhDTjQpsFyxZbL7evWSWBzRmu7uYT6yJ0D0ubI1QxrsSuP5mkaNo&usqp=CAU",
//     "name": "Road roller",
//     "price": 180,
//     "status": "true"
//   },
//   {
//     "id": "5",
//     "image": "/images/crane.jpg",
//     "name": "Crane",
//     "price": 150,
//     "status": "true"
//   },
// ];

// app.get("/", async function (request, response) {
//   const cart = await client
//     .db("rental")
//     .collection("cart")
//     .find({})
//     .toArray();
//   response.send(cart);
// });

app.get("/cart", async function (request, response) {
  const cart = await client
    .db("rental")
    .collection("cart")
    .find({})
    .toArray();
  response.send(cart);
});

app.get("/cart/:id", async function (request, response) {
  const { id } = request.params;
  const cart = await client
    .db("rental")
    .collection("cart")
    .findOne({ id: id });
cart
    ? response.send(cart)
    : response.status(404).send({ message: "item not found" });
});

app.post("/cart", express.json(), async function (request, response) {
  const data = request.body;
  const result = await client.db("rental").collection("cart").insertMany(data);
  response.send(result);
});

// app.delete("/cart/:id", async function (request, response) {
//   const { id } = request.params;
//   const result = await client
//     .db("rental")
//     .collection("cart")
//     .deleteOne({ id: id });
//   result.deleteCount>=1
//     ? response.send({message:"item has successfully deleted"})
//     : response.status(404).send({ message: "item not found" });
// });

app.put("/cart/:id",express.json(), async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await client
    .db("rental")
    .collection("cart")
    .updateOne({ id: id },{$set:data});
    response.send(result)
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
