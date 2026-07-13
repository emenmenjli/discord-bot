const Router = {
  _routes: {},

  route(path, handler) {
    this._routes[path] = handler;
  },

  async navigate(path) {
    const state = { path };
    window.history.pushState(state, '', path);
    await this._render(path);
  },

  async _render(path) {
    const app = document.getElementById('app');
    if (!app) return;

    // Exact match
    if (this._routes[path]) {
      app.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
      await this._routes[path](app);
      return;
    }

    // Pattern match: /dashboard/xxx
    for (const [pattern, handler] of Object.entries(this._routes)) {
      const regex = pattern.replace(/:\w+/g, '([^/]+)');
      const match = path.match(new RegExp(`^${regex}$`));
      if (match) {
        const params = pattern.match(/:(\w+)/g) || [];
        const args = {};
        params.forEach((p, i) => { args[p.slice(1)] = match[i + 1]; });
        app.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        await handler(app, args);
        return;
      }
    }

    // 404
    app.innerHTML = '<div class="container" style="padding-top:120px;text-align:center"><h1>404</h1><p style="color:var(--text2)">Page not found</p></div>';
  },

  init() {
    window.addEventListener('popstate', () => this._render(window.location.pathname));
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });
  },
};
