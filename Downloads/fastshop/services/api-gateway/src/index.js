import express from "express";
const app = express();
app.get("/health", (_, res) => res.json({ ok: true, service: "api-gateway" }));
app.listen(3000, () => console.log("api-gateway on 3000"));
