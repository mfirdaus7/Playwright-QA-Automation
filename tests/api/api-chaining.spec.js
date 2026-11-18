const { test, expect } = require("@playwright/test");
const { PostsApi } = require("../../api-clients/postsApi");

test("API chaining - POST, PATCH and DELETE", async ({ request }) => {
  const postsApi = new PostsApi(request);

  // 1. POST - Create a post
  const createResponse = await postsApi.createPost({
    title: "Playwright QA Automation",
    body: "Learning API chaining",
    userId: 1,
  });

  expect(createResponse.status()).toBe(201);

  const createdPost = await createResponse.json();

  expect(createdPost.title).toBe("Playwright QA Automation");
  expect(createdPost.userId).toBe(1);
  expect(createdPost.id).toBeTruthy();

  // 2. PATCH - Update using returned ID
  const updateResponse = await postsApi.patchPost(createdPost.id, {
    title: "Updated Playwright Post",
  });

  expect(updateResponse.status()).toBe(200);

  const updatedPost = await updateResponse.json();

  expect(updatedPost).toMatchObject({
    title: "Updated Playwright Post",
  });
  // 3. DELETE - Delete using returned ID
  const deleteResponse = await postsApi.deletePost(createdPost.id);

  expect(deleteResponse.status()).toBe(200);
});

test("POST - Incomplete request body", async ({ request }) => {
  const postsApi = new PostsApi(request);

  const response = await postsApi.createPost({
    title: "Incomplete Post",
  });

  expect(response.status()).toBe(201);

  const data = await response.json();

  expect(data.title).toBe("Incomplete Post");
  expect(data.id).toBeTruthy();
  expect(data).not.toHaveProperty("body");
  expect(data).not.toHaveProperty("userId");
});
