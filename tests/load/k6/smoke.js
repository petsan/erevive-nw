import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000/api/v1";

export default function () {
  // Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    "health status 200": (r) => r.status === 200,
    "health response time < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(1);

  // Register a new user
  const email = `load_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`;
  const registerRes = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify({
      email: email,
      password: "loadtest123",
      full_name: "Load Test User",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
  check(registerRes, { "register status 201": (r) => r.status === 201 });

  if (registerRes.status === 201) {
    const token = JSON.parse(registerRes.body).access_token;

    // Get current user
    const meRes = http.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    check(meRes, { "get me status 200": (r) => r.status === 200 });
  }

  sleep(1);
}
