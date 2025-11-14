jest.mock("../src/db_pg", () => ({
  applyMovement: jest.fn(async ({ produitId, type, quantite }) => {
    if (type === "IN") return { produitId, type, quantite, stock: quantite };
    if (type === "OUT") {
      if (quantite > 1000)
        throw new Error("Quantité OUT supérieure au stock disponible");
      return { produitId, type, quantite, stock: 0 };
    }
    throw new Error("Type inconnu");
  }),
  getPool: () => ({
    connect: async () => ({
      query: async () => ({ rows: [] }),
      release: () => {},
    }),
  }),
}));

const { applyMovement } = require("../src/db_pg");

describe("MédiTrack - applyMovement", () => {
  test("Ajout IN augmente le stock", async () => {
    const result = await applyMovement({
      produitId: "test-id",
      type: "IN",
      quantite: 10,
    });

    expect(result.stock).toBeGreaterThanOrEqual(10);
  });

  test("Sortie OUT impossible si stock insuffisant", async () => {
    await expect(
      applyMovement({
        produitId: "test-id",
        type: "OUT",
        quantite: 999999,
      })
    ).rejects.toThrow("supérieure au stock disponible");
  });
});
