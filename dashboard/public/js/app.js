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
        <div class="feature-card"><div class="icon">🎫</div><h3>Tickets</h3><p>Let users open tickets via <code>sticket</code> or click a button on the ticket panel. Staff gets a private channel with close and claim buttons. Assign staff roles from the dashboard.</p></div>
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
             <tr><td><code>swarns</code></td><td>View all warns for a user</td><td><code>swarns @user</code></td></tr>
             <tr><td><code>sclearwarns</code></td><td>Clear all warns for a user (admin)</td><td><code>sclearwarns @user</code></td></tr>
             <tr><td><code>sclear</code></td><td>Bulk delete messages</td><td><code>sclear 10</code></td></tr>
             <tr><td><code>sticket</code></td><td>Create a support ticket</td><td><code>sticket Need help with roles</code></td></tr>
             <tr><td><code>sclose</code></td><td>Close your open ticket</td><td><code>sclose</code></td></tr>
             <tr><td><code>sticketsetup</code></td><td>Post a ticket panel with buttons (admin)</td><td><code>sticketsetup</code></td></tr>
             <tr><td><code>srole give</code></td><td>Give a role to a user</td><td><code>srole give @user @role</code></td></tr>
             <tr><td><code>srole remove</code></td><td>Remove a role from a user</td><td><code>srole remove @user @role</code></td></tr>
             <tr><td><code>srole create</code></td><td>Create a new role</td><td><code>srole create Members #FF0000</code></td></tr>
             <tr><td><code>srole delete</code></td><td>Delete a role</td><td><code>srole delete @role</code></td></tr>
             <tr><td><code>srole rename</code></td><td>Rename a role</td><td><code>srole rename @role New Name</code></td></tr>
             <tr><td><code>srole color</code></td><td>Change a role's color</td><td><code>srole color @role #00FF00</code></td></tr>
             <tr><td><code>srole list</code></td><td>List all server roles</td><td><code>srole list</code></td></tr>
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

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'commands', label: 'Commands', icon: '⚙️' },
    { id: 'settings', label: 'Settings', icon: '🔧' },
    { id: 'leveling', label: 'Leveling', icon: '📈' },
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'autoroles', label: 'Autoroles', icon: '🎯' },
    { id: 'roles', label: 'Roles', icon: '🎨' },
    { id: 'moderation', label: 'Moderation', icon: '🛡️' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  app.innerHTML = nav(user) + `
    <div class="dash-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="${guild.icon || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="">
          <div>
            <strong>${guild.name}</strong>
            <span>${guild.memberCount} members</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${sidebarItems.map((item, i) => `
            <a href="#" class="sidebar-link ${i === 0 ? 'active' : ''}" data-page="${item.id}">
              <span class="sidebar-icon">${item.icon}</span>
              ${item.label}
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <a href="/dashboard" data-link class="sidebar-link">
            <span class="sidebar-icon">←</span>
            Back to Servers
          </a>
        </div>
      </aside>
      <main class="dash-content">
        <div class="dash-page active" id="page-overview">
          ${renderOverview(guild, settings, commands, autoroles)}
        </div>
        <div class="dash-page" id="page-commands">
          ${renderCommandsPage(guild.id, commands, roles, p)}
        </div>
        <div class="dash-page" id="page-settings">
          ${renderSettingsPage(guild.id, settings, channels)}
        </div>
        <div class="dash-page" id="page-leveling">
          ${renderLevelingPage(guild.id, settings)}
        </div>
        <div class="dash-page" id="page-tickets">
          ${renderTicketsPage(guild.id, settings, roles, categories)}
        </div>
        <div class="dash-page" id="page-autoroles">
          ${renderAutorolesPage(guild.id, autoroles, roles)}
        </div>
        <div class="dash-page" id="page-roles">
          ${renderRolesPage(guild.id, roles)}
        </div>
        <div class="dash-page" id="page-moderation">
          ${renderModerationPage(guild.id)}
        </div>
        <div class="dash-page" id="page-leaderboard">
          ${renderLeaderboardPage(leaderboard)}
        </div>
      </main>
    </div>
  `;
}

function renderOverview(guild, settings, commands, autoroles) {
  return `
    <div class="page-header">
      <h1>Overview</h1>
      <p>Server summary at a glance.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${commands.length}</div><div class="stat-label">Custom Commands</div></div>
      <div class="stat-card"><div class="stat-value">${autoroles.length}</div><div class="stat-label">Autoroles</div></div>
      <div class="stat-card"><div class="stat-value">${settings.leveling_enabled === 'true' ? 'On' : 'Off'}</div><div class="stat-label">Leveling</div></div>
      <div class="stat-card"><div class="stat-value">${settings.ticket_category ? 'On' : 'Off'}</div><div class="stat-label">Tickets</div></div>
    </div>
    <div class="card">
      <h3>Quick Actions</h3>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="switchPage('commands')">Manage Commands</button>
        <button class="btn btn-primary btn-sm" onclick="switchPage('settings')">Server Settings</button>
        <button class="btn btn-primary btn-sm" onclick="switchPage('roles')">Manage Roles</button>
        <button class="btn btn-primary btn-sm" onclick="switchPage('moderation')">View Mod Logs</button>
      </div>
    </div>
  `;
}

function renderCommandsPage(guildId, commands, roles, p) {
  return `
    <div class="page-header"><h1>Custom Commands</h1><p>Create and manage text and embed commands.</p></div>
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
      <button class="btn btn-primary btn-sm" onclick="createCommand('${guildId}')">Create Command</button>
    </div>
    <h3 style="margin-bottom:12px;margin-top:24px;">Existing Commands</h3>
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
          <button class="btn btn-danger btn-sm" onclick="deleteCommand('${guildId}','${c.name}')">Delete</button>
        </div>
      `).join('')}</div>`
    }
  `;
}

function renderSettingsPage(guildId, settings, channels) {
  return `
    <div class="page-header"><h1>Server Settings</h1><p>Prefix, welcome/leave messages.</p></div>
    <div class="card" style="max-width:500px;">
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
      <button class="btn btn-primary btn-sm" onclick="saveSettings('${guildId}')">Save Settings</button>
    </div>
  `;
}

function renderLevelingPage(guildId, settings) {
  return `
    <div class="page-header"><h1>Leveling</h1><p>Enable or disable XP gain from messages.</p></div>
    <div class="card" style="max-width:400px;">
      <div class="form-group">
        <label>Enable Leveling</label>
        <select id="l-enabled">
          <option value="true" ${settings.leveling_enabled === 'true' ? 'selected' : ''}>Enabled</option>
          <option value="false" ${settings.leveling_enabled !== 'true' ? 'selected' : ''}>Disabled</option>
        </select>
        <small>When disabled, no XP will be earned from messages.</small>
      </div>
      <button class="btn btn-primary btn-sm" onclick="saveLeveling('${guildId}')">Save</button>
    </div>
  `;
}

function renderTicketsPage(guildId, settings, roles, categories) {
  return `
    <div class="page-header"><h1>Tickets</h1><p>Configure the ticket system. Use \`sticketsetup\` in your server to post the ticket panel.</p></div>
    <div class="card" style="max-width:500px;">
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
      <button class="btn btn-primary btn-sm" onclick="saveTickets('${guildId}')">Save</button>
    </div>
  `;
}

function renderAutorolesPage(guildId, autoroles, roles) {
  return `
    <div class="page-header"><h1>Autoroles</h1><p>Automatically assign roles when someone joins.</p></div>
    <div class="card" style="max-width:400px;">
      <h3>Add Autorole</h3>
      <div class="form-group">
        <label>Role to assign on join</label>
        <select id="ar-role">
          <option value="">— Select —</option>
          ${roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary btn-sm" onclick="addAutorole('${guildId}')">Add</button>
    </div>
    ${autoroles.length === 0
      ? '<div class="empty"><div class="icon">📭</div><p>No autoroles configured.</p></div>'
      : `<div class="command-list" style="margin-top:16px;">${autoroles.map(ar => {
          const r = roles.find(x => x.id === ar.role_id);
          return `<div class="command-item">
            <span><strong>${r ? r.name : ar.role_id}</strong></span>
            <button class="btn btn-danger btn-sm" onclick="deleteAutorole('${guildId}','${ar.role_id}')">Remove</button>
          </div>`;
        }).join('')}</div>`
    }
  `;
}

function renderRolesPage(guildId, roles) {
  return `
    <div class="page-header"><h1>Role Management</h1><p>Create, rename, delete, or change role colors.</p></div>
    <div class="card" style="max-width:500px;">
      <h3>Create Role</h3>
      <div class="form-row">
        <div class="form-group">
          <label>Name</label>
          <input id="rl-name" placeholder="New Role">
        </div>
        <div class="form-group">
          <label>Color (hex)</label>
          <input id="rl-color" placeholder="#5865F2" value="#5865F2">
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="createRole('${guildId}')">Create Role</button>
    </div>
    <h3 style="margin-bottom:12px;margin-top:24px;">Existing Roles</h3>
    <div class="command-list">
      ${roles.filter(r => r.id !== guildId).map(r => `
        <div class="command-item">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${r.color || '#999'};"></span>
            <strong>${r.name}</strong>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-ghost btn-sm" onclick="renameRole('${guildId}','${r.id}','${r.name.replace(/'/g, "\\'")}')">Rename</button>
            <button class="btn btn-ghost btn-sm" onclick="recolorRole('${guildId}','${r.id}','${r.color || '#5865F2'}')">Color</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRole('${guildId}','${r.id}','${r.name.replace(/'/g, "\\'")}')">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderModerationPage(guildId) {
  return `
    <div class="page-header"><h1>Moderation Logs</h1><p>View recent moderation cases. Warns, mutes, kicks, bans.</p></div>
    <div class="card" style="max-width:500px;">
      <div class="form-row">
        <div class="form-group">
          <label>Filter by User ID</label>
          <input id="mod-userid" placeholder="Leave empty for all">
        </div>
        <div class="form-group">
          <label>Type</label>
          <select id="mod-type">
            <option value="">All types</option>
            <option value="warn">Warns</option>
            <option value="mute">Mutes</option>
            <option value="kick">Kicks</option>
            <option value="ban">Bans</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="loadCases('${guildId}')">Load Cases</button>
    </div>
    <div id="mod-results"><div class="empty"><div class="icon">🔍</div><p>Click "Load Cases" to view moderation logs.</p></div></div>
  `;
}

function renderLeaderboardPage(leaderboard) {
  return `
    <div class="page-header"><h1>Leaderboard</h1><p>Top members by XP and level.</p></div>
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
  `;
}

function makeChannelOptions(channels, selected) {
  return '<option value="">— None —</option>' + channels.map(c =>
    `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${c.name}</option>`
  ).join('');
}

// ========== SIDEBAR ==========
function switchPage(pageId) {
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.dash-page').forEach(p => p.classList.remove('active'));
  const link = document.querySelector(`.sidebar-link[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('.sidebar-link[data-page]');
  if (link) {
    e.preventDefault();
    switchPage(link.dataset.page);
  }
});

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

// ========== ROLE ACTIONS ==========

async function createRole(guildId) {
  const name = document.getElementById('rl-name').value.trim();
  const color = document.getElementById('rl-color').value.trim();
  if (!name) return toast('Role name is required.');
  await API.post(`/api/guild/${guildId}/roles`, { name, color });
  toast('Role created!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function deleteRole(guildId, roleId, name) {
  if (!confirm(`Delete role "${name}"?`)) return;
  await API.del(`/api/guild/${guildId}/roles/${roleId}`);
  toast('Role deleted!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function renameRole(guildId, roleId, currentName) {
  const newName = prompt('New name:', currentName);
  if (!newName || newName === currentName) return;
  await API.patch(`/api/guild/${guildId}/roles/${roleId}`, { name: newName });
  toast('Role renamed!');
  Router.navigate(`/dashboard/${guildId}`);
}

async function recolorRole(guildId, roleId, currentColor) {
  const newColor = prompt('New hex color (e.g. #FF0000):', currentColor);
  if (!newColor || newColor === currentColor) return;
  await API.patch(`/api/guild/${guildId}/roles/${roleId}`, { color: newColor });
  toast('Role color changed!');
  Router.navigate(`/dashboard/${guildId}`);
}

// ========== MODERATION ACTIONS ==========

async function loadCases(guildId) {
  const userId = document.getElementById('mod-userid').value.trim();
  const type = document.getElementById('mod-type').value;
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  if (type) params.set('type', type);
  const qs = params.toString();
  const cases = await API.get(`/api/guild/${guildId}/cases${qs ? '?' + qs : ''}`);
  const el = document.getElementById('mod-results');
  if (!cases || cases.length === 0) {
    el.innerHTML = '<div class="empty"><div class="icon">📭</div><p>No cases found.</p></div>';
    return;
  }
  el.innerHTML = `
    <div class="table-wrap" style="margin-top:16px;">
      <table>
        <thead><tr><th>#</th><th>User</th><th>Type</th><th>Reason</th><th>Moderator</th><th>Action</th></tr></thead>
        <tbody>
          ${cases.map(c => `<tr>
            <td>${c.id}</td>
            <td>${c.user_tag}</td>
            <td><span class="badge-type badge-${c.type}">${c.type}</span></td>
            <td>${c.reason}</td>
            <td>${c.moderator_tag}</td>
            <td>${c.type === 'warn' ? `<button class="btn btn-danger btn-sm" onclick="clearWarnCases('${guildId}','${c.user_id}')">Clear Warns</button>` : ''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function clearWarnCases(guildId, userId) {
  if (!confirm('Clear all warns for this user?')) return;
  await API.del(`/api/guild/${guildId}/cases/${userId}/warn`);
  toast('Warns cleared!');
  loadCases(guildId);
}

// ========== INIT ==========
Router.route('/', renderHome);
Router.route('/dashboard', renderDashboard);
Router.route('/dashboard/:guildId', renderGuildSettings);

Router.init();

(async () => {
  const path = window.location.pathname;
  await Router._render(path);
})();
