let currentUser = null;

function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div'); el.id = 'toast'; el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

function nav(user) {
  const isLoggedIn = !!user;
  const avatar = user ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '';
  return `
    <nav class="nav">
      <div class="nav-inner">
        <a href="/" data-link class="logo">✦ Bot Dashboard</a>
        <div class="nav-links">
          ${isLoggedIn ? `
            <a href="/dashboard" data-link>Servers</a>
            <div class="user-badge">
              <img src="${avatar}" alt="">
              <span>${user.username}</span>
            </div>
            <a href="/logout" class="btn btn-ghost btn-sm">Logout</a>
          ` : `<a href="/login" class="btn btn-discord btn-sm">Login with Discord</a>`}
        </div>
      </div>
    </nav>
  `;
}

// ========== PAGES ==========

async function renderHome(app) {
  const user = await API.get('/api/user').catch(() => null);
  currentUser = user;
  app.innerHTML = nav(user) + `
    <section class="hero">
      <div class="hero-badge">⚡ Free & Open Source</div>
      <h1>Your All-in-One<br>Discord Bot</h1>
      <p>Custom commands, moderation, leveling, tickets, autoroles, welcome messages — all managed from a beautiful web dashboard. No coding required.</p>
      <div class="hero-actions">
        <a href="https://discord.com/oauth2/authorize?client_id=1521599353980981318" target="_blank" class="btn btn-discord btn-lg">Add to Discord</a>
        ${user
          ? `<a href="/dashboard" data-link class="btn btn-primary btn-lg">Dashboard →</a>`
          : `<a href="/login" class="btn btn-ghost btn-lg">Login with Discord</a>`}
      </div>
    </section>

    <div class="container" id="features">
      <div class="section-label">Features</div>
      <h2 class="section-title">Everything You Need</h2>
      <div class="features">
        <div class="feature-card"><div class="icon">⚙️</div><h3>Custom Commands</h3><p>Create your own commands with dynamic placeholders. Restrict them to specific roles or let everyone use them. Supports text responses and rich embeds.</p><div class="example">${user ? '' : 's}hello → Hello @user! Welcome to My Server.'}</div></div>
        <div class="feature-card"><div class="icon">🛡️</div><h3>Moderation</h3><p>Kick, ban, mute, warn, and purge messages — all with automatic case logging. Keep your server safe with powerful moderation tools.</p></div>
        <div class="feature-card"><div class="icon">📈</div><h3>Leveling</h3><p>Members earn XP by chatting in text channels. Track progress with levels and a leaderboard. Enable or disable anytime from the dashboard.</p></div>
        <div class="feature-card"><div class="icon">🎫</div><h3>Tickets</h3><p>Let users open support tickets with <code>sticket</code>. Staff gets a private channel to help. Close tickets with <code>sclose</code>. Assign staff roles from the dashboard.</p></div>
        <div class="feature-card"><div class="icon">👋</div><h3>Welcome & Leave</h3><p>Greet new members and say goodbye when they leave. Fully customizable messages with placeholders for user name, server name, and member count.</p></div>
        <div class="feature-card"><div class="icon">🎯</div><h3>Autoroles</h3><p>Automatically assign roles when someone joins your server. Set up multiple autoroles from the dashboard — perfect for verification or self-roles.</p></div>
      </div>
    </div>

    <div class="container" id="commands">
      <div class="divider"></div>
      <div class="section-label">Commands</div>
      <h2 class="section-title">Full Command Reference</h2>
      <p style="color:var(--text2);margin-bottom:24px;max-width:600px;">The default prefix is <code>s</code>. You can change it anytime from the dashboard settings.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Command</th><th>Description</th><th>Usage</th></tr></thead>
          <tbody>
            <tr><td><code>sping</code></td><td>Check if the bot is online</td><td><code>sping</code></td></tr>
            <tr><td><code>shelp</code></td><td>Show all available commands</td><td><code>shelp</code></td></tr>
            <tr><td><code>srank</code></td><td>Check your XP and level</td><td><code>srank</code> or <code>srank @user</code></td></tr>
            <tr><td><code>sleaderboard</code></td><td>Show the server level leaderboard</td><td><code>sleaderboard</code></td></tr>
            <tr><td><code>skick</code></td><td>Kick a member from the server</td><td><code>skick @user reason</code></td></tr>
            <tr><td><code>sban</code></td><td>Ban a member from the server</td><td><code>sban @user reason</code></td></tr>
            <tr><td><code>smute</code></td><td>Mute a member (text only)</td><td><code>smute @user reason</code></td></tr>
            <tr><td><code>sunmute</code></td><td>Unmute a member</td><td><code>sunmute @user</code></td></tr>
            <tr><td><code>swarn</code></td><td>Warn a member (logged)</td><td><code>swarn @user reason</code></td></tr>
            <tr><td><code>sclear</code></td><td>Bulk delete messages</td><td><code>sclear 10</code></td></tr>
            <tr><td><code>sticket</code></td><td>Create a support ticket</td><td><code>sticket Need help with roles</code></td></tr>
            <tr><td><code>sclose</code></td><td>Close your open ticket</td><td><code>sclose</code></td></tr>
            <tr><td><code>s[command]</code></td><td>Run any custom command created in the dashboard</td><td><code>shello</code></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="container" id="guide">
      <div class="divider"></div>
      <div class="section-label">Getting Started</div>
      <h2 class="section-title">Setup Guide</h2>
      <div class="guide-steps">
        <div class="guide-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Invite the Bot</h3>
            <p>Click the <strong>Add to Discord</strong> button above. Select your server and authorize the bot. It needs basic permissions to read messages, send messages, manage channels, and moderate members.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Login to Dashboard</h3>
            <p>Click <strong>Login with Discord</strong> to access the dashboard. You must have <strong>Manage Server</strong> permission in your server to configure the bot.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Configure Your Server</h3>
            <p>Select your server from the dashboard. Use the tabs to set up custom commands, configure welcome/leave messages, enable leveling, set up tickets, and assign autoroles.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3>Start Using Commands</h3>
            <p>Once configured, members can use the <code>s</code> prefix in your server. Type <code>shelp</code> to see all available commands, or use the custom commands you created!</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container" id="invite">
      <div class="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Add the bot to your server and take control from the dashboard.</p>
        <a href="https://discord.com/oauth2/authorize?client_id=1521599353980981318" target="_blank" class="btn btn-discord btn-lg">Add to Discord</a>
      </div>
    </div>

    <footer class="footer">
      <p>Built with ❤️ &middot; Open source Discord bot</p>
    </footer>
  `;
}

async function renderDashboard(app) {
  const user = await API.get('/api/user');
  if (!user) { window.location = '/'; return; }
  currentUser = user;

  const guilds = await API.get('/api/guilds') || [];

  app.innerHTML = nav(user) + `
    <div class="container">
      <div class="dash-header">
        <div>
          <h1>Your Servers</h1>
          <p>Select a server to configure the bot.</p>
        </div>
      </div>
      ${guilds.length === 0
        ? '<div class="empty"><div class="icon">📭</div><p>No servers found. Make sure the bot is in your server and you have Manage Server permission.</p></div>'
        : `<div class="guild-grid">${guilds.map(g => `
          <a href="/dashboard/${g.id}" data-link class="guild-card">
            <img src="${g.icon || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="">
            <div class="guild-info">
              <strong>${g.name}</strong>
              <span>${g.memberCount} members</span>
            </div>
          </a>
        `).join('')}</div>`
      }
    </div>
  `;
}

async function renderGuildSettings(app, params) {
  const user = await API.get('/api/user');
  if (!user) { window.location = '/'; return; }
  currentUser = user;

  const data = await API.get(`/api/guild/${params.guildId}`);
  if (!data) return;

  const { guild, settings, commands, autoroles, leaderboard, roles, channels, categories } = data;
  const p = settings.prefix || 's';

  app.innerHTML = nav(user) + `
    <div class="container">
      <div class="page-header">
        <img src="${guild.icon || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="">
        <div>
          <h1>${guild.name}</h1>
          <span style="color:var(--text2);font-size:0.85rem;">${guild.memberCount} members</span>
        </div>
      </div>

      <div class="tabs">
        <button class="tab-btn active" data-tab="commands">Custom Commands</button>
        <button class="tab-btn" data-tab="settings">Settings</button>
        <button class="tab-btn" data-tab="leveling">Leveling</button>
        <button class="tab-btn" data-tab="tickets">Tickets</button>
        <button class="tab-btn" data-tab="autoroles">Autoroles</button>
        <button class="tab-btn" data-tab="leaderboard">Leaderboard</button>
      </div>

      <!-- Commands -->
      <div class="tab-content active" id="tab-commands">
        <div class="card" style="max-width:600px;">
          <h3>Create Command</h3>
          <div class="form-group">
            <label>Command Name (without prefix)</label>
            <input id="cmd-name" placeholder="hello">
          </div>
          <div class="form-group">
            <label>Response Message</label>
            <textarea id="cmd-response" placeholder="Hello {user}! Welcome to {server}." rows="3"></textarea>
            <small>Use: {user} {user.name} {server} {channel} {args}</small>
          </div>
          <div class="form-group">
            <label>Allowed Roles (hold Ctrl)</label>
            <select id="cmd-roles" multiple>${roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}</select>
            <small>Leave empty for everyone.</small>
          </div>
          <div class="form-group">
            <label>Embed JSON (optional)</label>
            <textarea id="cmd-embed" placeholder='{"title":"Hello","description":"World","color":5793266}' rows="2"></textarea>
          </div>
          <button class="btn btn-primary btn-sm" onclick="createCommand('${guild.id}')">Create Command</button>
        </div>

        <h3 style="margin-bottom:12px;">Existing Commands</h3>
        ${commands.length === 0
          ? '<div class="empty"><div class="icon">📭</div><p>No custom commands yet.</p></div>'
          : `<div class="command-list">${commands.map(c => `
            <div class="command-item">
              <div>
                <div class="cmd-name">${p}${c.name}</div>
                <div class="cmd-response">${c.response || '[Embed]'}</div>
                ${c.allowed_roles && JSON.parse(c.allowed_roles).length
                  ? `<div class="cmd-roles">${JSON.parse(c.allowed_roles).map(rid => {
                      const r = roles.find(x => x.id === rid);
                      return `<span class="role-badge">${r ? r.name : rid}</span>`;
                    }).join('')}</div>`
                  : '<span class="badge-public">🔓 Everyone</span>'}
                <div class="cmd-usage">Used ${c.usage_count} times</div>
              </div>
              <button class="btn btn-danger btn-sm" onclick="deleteCommand('${guild.id}','${c.name}')">Delete</button>
            </div>
          `).join('')}</div>`
        }
      </div>

      <!-- Settings -->
      <div class="tab-content" id="tab-settings">
        <div class="card" style="max-width:500px;">
          <h3>Server Settings</h3>
          <div class="form-group">
            <label>Command Prefix</label>
            <input id="s-prefix" value="${settings.prefix || 's'}" maxlength="3">
          </div>
          <div class="form-group">
            <label>Welcome Channel</label>
            <select id="s-welcome-channel">${makeChannelOptions(channels, settings.welcome_channel)}</select>
          </div>
          <div class="form-group">
            <label>Welcome Message</label>
            <textarea id="s-welcome-msg" rows="2">${settings.welcome_message || ''}</textarea>
            <small>{user} {user.name} {server} {count}</small>
          </div>
          <div class="form-group">
            <label>Leave Channel</label>
            <select id="s-leave-channel">${makeChannelOptions(channels, settings.leave_channel)}</select>
          </div>
          <div class="form-group">
            <label>Leave Message</label>
            <textarea id="s-leave-msg" rows="2">${settings.leave_message || ''}</textarea>
          </div>
          <button class="btn btn-primary btn-sm" onclick="saveSettings('${guild.id}')">Save Settings</button>
        </div>
      </div>

      <!-- Leveling -->
      <div class="tab-content" id="tab-leveling">
        <div class="card" style="max-width:400px;">
          <h3>Leveling System</h3>
          <div class="form-group">
            <label>Enable Leveling</label>
            <select id="l-enabled">
              <option value="true" ${settings.leveling_enabled === 'true' ? 'selected' : ''}>Enabled</option>
              <option value="false" ${settings.leveling_enabled !== 'true' ? 'selected' : ''}>Disabled</option>
            </select>
            <small>When disabled, no XP will be earned from messages.</small>
          </div>
          <button class="btn btn-primary btn-sm" onclick="saveLeveling('${guild.id}')">Save</button>
        </div>
      </div>

      <!-- Tickets -->
      <div class="tab-content" id="tab-tickets">
        <div class="card" style="max-width:500px;">
          <h3>Ticket Settings</h3>
          <div class="form-group">
            <label>Ticket Category</label>
            <select id="t-category">
              <option value="">— Disabled —</option>
              ${categories.map(c => `<option value="${c.id}" ${settings.ticket_category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Staff Roles</label>
            <select id="t-staff" multiple>
              ${roles.map(r => {
                const staff = JSON.parse(settings.ticket_staff_roles || '[]') || [];
                return `<option value="${r.id}" ${staff.includes(r.id) ? 'selected' : ''}>${r.name}</option>`;
              }).join('')}
            </select>
          </div>
          <button class="btn btn-primary btn-sm" onclick="saveTickets('${guild.id}')">Save</button>
        </div>
      </div>

      <!-- Autoroles -->
      <div class="tab-content" id="tab-autoroles">
        <div class="card" style="max-width:400px;">
          <h3>Add Autorole</h3>
          <div class="form-group">
            <label>Role to assign on join</label>
            <select id="ar-role">
              <option value="">— Select —</option>
              ${roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary btn-sm" onclick="addAutorole('${guild.id}')">Add</button>
        </div>

        ${autoroles.length === 0
          ? '<div class="empty"><div class="icon">📭</div><p>No autoroles configured.</p></div>'
          : `<div class="command-list">${autoroles.map(ar => {
            const r = roles.find(x => x.id === ar.role_id);
            return `<div class="command-item">
              <span><strong>${r ? r.name : ar.role_id}</strong></span>
              <button class="btn btn-danger btn-sm" onclick="deleteAutorole('${guild.id}','${ar.role_id}')">Remove</button>
            </div>`;
          }).join('')}</div>`
        }
      </div>

      <!-- Leaderboard -->
      <div class="tab-content" id="tab-leaderboard">
        <h3 style="margin-bottom:12px;">🏆 Leaderboard</h3>
        ${leaderboard.length === 0
          ? '<div class="empty"><div class="icon">📭</div><p>Enable leveling in the Leveling tab first.</p></div>'
          : `<div class="table-wrap"><table><thead><tr><th>#</th><th>User</th><th>Level</th><th>XP</th></tr></thead>
            <tbody>${leaderboard.map((e, i) => `<tr>
              <td><strong>${i+1}</strong></td>
              <td>${e.user_id}</td>
              <td>${e.level}</td>
              <td>${e.xp}</td>
            </tr>`).join('')}</tbody></table></div>`
        }
      </div>
    </div>
  `;
}

function makeChannelOptions(channels, selected) {
  return '<option value="">— None —</option>' + channels.map(c =>
    `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${c.name}</option>`
  ).join('');
}

// ========== ACTIONS ==========

async function createCommand(guildId) {
  const name = document.getElementById('cmd-name').value.trim();
  const response = document.getElementById('cmd-response').value.trim();
  const embed = document.getElementById('cmd-embed').value.trim();
  const roles = Array.from(document.getElementById('cmd-roles').selectedOptions).map(o => o.value);
  if (!name) return toast('Command name is required.');
  await API.post(`/api/guild/${guildId}/commands`, { name, response, embed: embed || null, allowed_roles: roles });
  toast('Command created!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function deleteCommand(guildId, name) {
  await API.del(`/api/guild/${guildId}/commands/${name}`);
  toast('Command deleted!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function saveSettings(guildId) {
  await API.patch(`/api/guild/${guildId}/settings`, {
    prefix: document.getElementById('s-prefix').value,
    welcome_channel: document.getElementById('s-welcome-channel').value || null,
    welcome_message: document.getElementById('s-welcome-msg').value || null,
    leave_channel: document.getElementById('s-leave-channel').value || null,
    leave_message: document.getElementById('s-leave-msg').value || null,
  });
  toast('Settings saved!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function saveLeveling(guildId) {
  await API.patch(`/api/guild/${guildId}/settings`, {
    leveling_enabled: document.getElementById('l-enabled').value,
  });
  toast('Leveling settings saved!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function saveTickets(guildId) {
  const staff = Array.from(document.getElementById('t-staff').selectedOptions).map(o => o.value);
  await API.patch(`/api/guild/${guildId}/settings`, {
    ticket_category: document.getElementById('t-category').value || null,
    ticket_staff_roles: JSON.stringify(staff),
  });
  toast('Ticket settings saved!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function addAutorole(guildId) {
  const roleId = document.getElementById('ar-role').value;
  if (!roleId) return toast('Select a role.');
  await API.post(`/api/guild/${guildId}/autoroles`, { role_id: roleId });
  toast('Autorole added!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function deleteAutorole(guildId, roleId) {
  await API.del(`/api/guild/${guildId}/autoroles/${roleId}`);
  toast('Autorole removed!');
  Router.navigate(`/dashboard/${guildId}`);
}

// ========== TABS ==========
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab-btn');
  if (!tab) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const el = document.getElementById('tab-' + tab.dataset.tab);
  if (el) el.classList.add('active');
});

// ========== INIT ==========
Router.route('/', renderHome);
Router.route('/dashboard', renderDashboard);
Router.route('/dashboard/:guildId', renderGuildSettings);

Router.init();

(async () => {
  const path = window.location.pathname;
  await Router._render(path);
})();
