class PostsApi {
  constructor(request) {
    this.request = request;
  }

  async createPost(postData) {
    return this.request.post("/posts", {
      data: postData,
    });
  }

  async updatePost(postId, postData) {
    return this.request.put(`/posts/${postId}`, {
      data: postData,
    });
  }

  async deletePost(postId) {
    return this.request.delete(`/posts/${postId}`);
  }

  async patchPost(postId, postData) {
    return this.request.patch(`/posts/${postId}`, {
      data: postData,
    });
  }
}

module.exports = { PostsApi };
