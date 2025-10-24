import request from "supertest";
import { createApp } from "../createApp";

const app = createApp();

describe("App Endpoints", () => {
  it("should return 200 for the root endpoint", async () => {
    const res = await request(app).get("/api/test/status");
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty("message");
  });
});
