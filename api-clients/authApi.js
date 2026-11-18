class AuthApi {
  constructor(request) {
    this.request = request;
  }

  getAuthHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async login(credentials) {
    return this.request.post("/auth/login", {
      data: credentials,
    });
  }

  async getCurrentUser(token) {
    return this.request.get("/auth/me", {
      headers: this.getAuthHeaders(token),
    });
  }

  async refreshToken(refreshToken) {
    return this.request.post("/auth/refresh", {
      data: {
        refreshToken,
        expiresInMins: 30,
      },
    });
  }
}

module.exports = { AuthApi };
