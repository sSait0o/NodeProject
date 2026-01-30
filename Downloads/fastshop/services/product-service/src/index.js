import express from "express";

const app = express();
app.get("/health", (_, res) => res.json({ ok: true, service: "product-service" }));
app.get("/products", (_, res) => res.json([{ id: 1, name: "Demo Product" }]));
app.listen(3001, () => console.log("product-service on 3001"));
