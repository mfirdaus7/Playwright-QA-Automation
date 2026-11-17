const userSchema = {
  type: "object",
  required: ["id", "name", "email"],
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
  },
};

module.exports = { userSchema };
