import express from "express";
const app = express();
app.get("/health", (_, res) => res.send("ok"));
app.get("/", (_, res) => res.send("FastShop minimal frontend"));
app.listen(8080, () => console.log("frontend on 8080"));
