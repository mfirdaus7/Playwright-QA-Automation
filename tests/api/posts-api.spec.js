const { test, expect } = require("@playwright/test");

let apiRequest;

test.beforeAll(async ({ playwright }) => {
  apiRequest = await playwright.request.newContext({
    baseURL: process.env.API_BASE_URL,
  });
});

test.afterAll(async () => {
  await apiRequest.dispose();
});

/* post API tests - create new post */
test("POST should create a new post", async () => {
  const newPost = {
    title: "Playwright API Testing",
    body: "Learning POST request automation",
    userId: 1,
  };

  const response = await apiRequest.post("/posts", {
    data: newPost,
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody).toMatchObject({
    title: newPost.title,
    body: newPost.body,
    userId: newPost.userId,
  });

  expect(responseBody.id).toBeDefined();
});

/* post API tests - update existing post */
test("PUT should update an existing post", async () => {
  const updatedPost = {
    id: 1,
    title: "Updated Playwright API Testing",
    body: "Learning PUT request automation",
    userId: 1,
  };

  const response = await apiRequest.put("/posts/1", {
    data: updatedPost,
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toMatchObject(updatedPost);
  expect(responseBody.id).toBe(1);
});

/* post API tests - delete existing post */
test("DELETE should delete an existing post", async () => {
  const response = await apiRequest.delete("/posts/1");

  expect(response.status()).toBe(200);
});

/* post API tests - update specific fields */
test("PATCH should update only selected fields", async () => {
  const updatedData = {
    title: "Updated Title Only",
  };

  const response = await apiRequest.patch("/posts/1", {
    data: updatedData,
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.title).toBe(updatedData.title);
  expect(responseBody.id).toBe(1);
});
