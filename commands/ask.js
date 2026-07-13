const config = require('../config');

module.exports = {
  name: 'ask',
  description: 'Ask the AI anything',
  async execute(message, args) {
    const question = args.join(' ');
    if (!question) {
      return message.reply('❌ Please ask a question. Example: `sask What is the capital of France?`');
    }

    const apiKey = process.env.OPENAI_API_KEY || config.openaiKey;
    if (!apiKey) {
      return message.reply('❌ AI is not configured. Ask the server owner to set an OpenAI API key.');
    }

    await message.channel.sendTyping();

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful Discord bot assistant. Answer concisely but thoroughly.' },
            { role: 'user', content: question },
          ],
          max_tokens: 500,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`API error ${res.status}: ${err}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No response generated.';

      if (reply.length > 1900) {
        const chunks = reply.match(/[\s\S]{1,1900}/g);
        for (const chunk of chunks) {
          await message.channel.send(chunk);
        }
      } else {
        await message.channel.send(reply);
      }
    } catch (err) {
      console.error('AI error:', err);
      message.reply(`❌ AI error: ${err.message}`);
    }
  },
};
