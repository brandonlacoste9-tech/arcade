import { gamesData } from '../src/data/games.js';

// If you create a Discord Webhook, place the URL here!
// e.g. "https://discord.com/api/webhooks/12345/abcde"
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || null;

const BASE_URL = 'https://hellyeah-games.com';

const HYPE_MESSAGES = [
  "🔥 Can you beat the high score? Play [TITLE] right now on Hell Yeah Games!",
  "🚨 New obsession unlocked! Dive into [TITLE] for free right here:",
  "🎮 Looking for something new to play? Check out [TITLE]. First 1.5 hours are entirely on us!",
  "⚡ Start your weekend right. Play [TITLE] instantly in your browser right now:",
  "🏆 Only 1% of players can master [TITLE]. Are you one of them? Prove it here:"
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateMarketingPost = () => {
  // Pick a random game
  const randomGame = gamesData[Math.floor(Math.random() * gamesData.length)];
  
  // Pick a random hype message
  const randomHype = HYPE_MESSAGES[Math.floor(Math.random() * HYPE_MESSAGES.length)];
  const content = randomHype.replace('[TITLE]', `**${randomGame.title}**`);
  const link = `${BASE_URL}/game/${randomGame.id}`;

  return {
    content: `${content}\n\n👉 Play now: ${link}`,
    embeds: [
      {
        title: randomGame.title,
        description: randomGame.description.substring(0, 200) + '...',
        url: link,
        color: 16716947, // Neon Pink (Decimal)
        image: {
          url: randomGame.coverUrl
        }
      }
    ]
  };
};

const postToDiscord = async (postData) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.log("=========================================");
    console.log("[SIMULATED BOT POST] Discord Webhook not configured.");
    console.log(postData.content);
    console.log(`IMAGE URL: ${postData.embeds[0].image.url}`);
    console.log("=========================================\n");
    return;
  }

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (res.ok) {
      console.log(`[BOT] Successfully posted marketing for ${postData.embeds[0].title}`);
    } else {
      console.error(`[BOT] Failed to post: ${res.statusText}`);
    }
  } catch (err) {
    console.error(`[BOT] Error posting to Discord:`, err);
  }
};

const runBot = async () => {
  console.log("🚀 Empire Traffic Bot Started!");
  
  // If run with --test flag, run once immediately
  if (process.argv.includes('--test')) {
    console.log("Running test burst...");
    const post = generateMarketingPost();
    await postToDiscord(post);
    return;
  }

  // Otherwise run continuously (e.g., every 4 hours = 14400000 ms)
  const INTERVAL_MS = 4 * 60 * 60 * 1000;
  
  console.log(`Bot will automatically market a game every 4 hours.`);
  
  while (true) {
    const post = generateMarketingPost();
    await postToDiscord(post);
    // Wait 4 hours
    await sleep(INTERVAL_MS);
  }
};

runBot();
