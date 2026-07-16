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
