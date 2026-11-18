const invalidUsers = [
  {
    scenario: "Invalid id type",
    data: {
      id: "1",
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      address: {},
      phone: "123456",
      website: "test.com",
      company: {},
    },
    expectedKeyword: "type",
    expectedParams: {
      type: "number",
    },
  },
  {
    scenario: "Missing email",
    data: {
      id: 1,
      name: "Test User",
      username: "testuser",
      address: {},
      phone: "123456",
      website: "test.com",
      company: {},
    },
    expectedKeyword: "required",
    expectedParams: {
      missingProperty: "email",
    },
  },
];

module.exports = { invalidUsers };
