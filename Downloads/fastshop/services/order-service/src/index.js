import express from "express";

const app = express();
app.get("/health", (_, res) => res.json({ ok: true, service: "order-service" }));
app.get("/orders", (_, res) => res.json([{ id: 1, status: "DEMO" }]));
app.listen(3002, () => console.log("order-service on 3002"));
