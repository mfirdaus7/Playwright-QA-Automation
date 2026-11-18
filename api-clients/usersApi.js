class UsersApi {
  constructor(request) {
    this.request = request;
  }

  async getUser(userId) {
    const url = `/users/${userId}`;

    return this.request.get(url);
  }

  async createUser(userData) {
    return this.request.post("/users", {
      data: userData,
    });
  }
}

module.exports = { UsersApi };
