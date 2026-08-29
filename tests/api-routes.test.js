import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";

import { createApp } from "../api/index.js";

test("login endpoint returns a token for the seeded admin user", async () => {
  const app = createApp();
  const server = app.listen(0);
  await once(server, "listening");

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@mmgburger.test",
        password: "admin123",
      }),
    });

    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.success, true);
    assert.ok(data.token);
    assert.equal(data.user.role, "admin");
  } finally {
    server.close();
  }
});

test("order endpoint recalculates total from items and ignores malicious frontend values", async () => {
  const app = createApp();
  const server = app.listen(0);
  await once(server, "listening");

  try {
    const address = server.address();

    const loginResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "cliente@mmgburger.test",
          password: "cliente123",
        }),
      },
    );

    const loginData = await loginResponse.json();
    assert.equal(loginResponse.status, 200);
    assert.ok(loginData.token);

    const response = await fetch(`http://127.0.0.1:${address.port}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
      body: JSON.stringify({
        items: [
          { productId: "b1", name: "MMG Classic", quantity: 2 },
          { productId: "b2", name: "MMG Spicy BBQ", quantity: 1 },
        ],
        totalPrice: 9999,
      }),
    });

    assert.equal(response.status, 201);
    const data = await response.json();
    assert.equal(data.success, true);
    assert.equal(data.order.totalPrice, 26.5);
  } finally {
    server.close();
  }
});
