require('dotenv').config();

console.log('🚀 Starting bot...');
require('./bot');

try {
  console.log('🌐 Starting dashboard...');
  require('./dashboard/index');
} catch (err) {
  console.log('⚠️ Dashboard skipped (env vars not configured):', err.message);
}
