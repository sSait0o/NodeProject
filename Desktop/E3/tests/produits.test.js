const request = require("supertest");
const { app } = require("../server.Js");

jest.mock("../src/middleware/authMiddleware", () => {
  return (req, _res, next) => next();
});

describe("POST /produits", () => {
  test("Refuse quantite négative", async () => {
    const res = await request(app).post("/produits").send({
      nom: "Test",
      code: "X1",
      quantite: -1,
      depot_id: "test",
    });

    expect(res.statusCode).toBe(400);
  });
});
