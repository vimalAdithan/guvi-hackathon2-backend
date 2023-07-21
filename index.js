import * as dotenv from "dotenv"; 
dotenv.config();
// const express = require("express");
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
const app = express();
const MONGO_URL=process.env.MONGO_URL;
const PORT = process.env.PORT;
app.use(cors());
// const PORT = 4000;
// const MONGO_URL = "mongodb://127.0.0.1";

const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.get("/", async function (request, response) {
  const cart = await client.db("rental").collection("cart").find({}).toArray();
  response.send(cart);
});

app.get("/available", async function (request, response) {
  const cart = await client
    .db("rental")
    .collection("cart")
    .find({ status: true })
    .toArray();
  response.send(cart);
});

app.get("/cart", async function (request, response) {
  const cart = await client.db("rental").collection("cart").find({}).toArray();
  response.send(cart);
});

app.get("/cart/:id", async function (request, response) {
  const { id } = request.params;
  const cart = await client.db("rental").collection("cart").findOne({ _id:new ObjectId(id)});
  cart
    ? response.send(cart)
    : response.status(404).send({ message: "item not found" });
    console.log(cart);
});

app.post("/add", express.json(), async function (request, response) {
  const data = request.body;
  const result = await client.db("rental").collection("cart").insertOne(data);
  response.send(result);
});


// response.header('access-Control-Allow-Origin','*')
// response.header('access-Control-Allow-Method','*')
// response.header('access-Control-Allow-Headers','*')

app.delete("/cart/:id", async function (request, response) {
  const { id } = request.params;
  const result = await client
    .db("rental")
    .collection("cart")
    .deleteOne({_id:new ObjectId(id) });
  result.deletedCount>=1
    ? response.send({message:"item has successfully deleted"})
    : response.status(404).send({ message: "item not found" });
});

app.put("/cart/:id", express.json(), async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await client
    .db("rental")
    .collection("cart")
    .updateOne({_id:new ObjectId(id)}, { $set: data });
  response.send(result);
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
