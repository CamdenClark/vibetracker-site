export default {
  async fetch(request, env) {
    // Serve static assets from the public directory
    return env.ASSETS.fetch(request);
  },
};
