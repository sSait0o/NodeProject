const jwt = require("jsonwebtoken");

test("JWT contient id et role", () => {
  const token = jwt.sign({ id: "123", role: "admin" }, "test-secret");
  const decoded = jwt.verify(token, "test-secret");
  expect(decoded.role).toBe("admin");
});
