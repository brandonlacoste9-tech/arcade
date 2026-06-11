const fs = require('fs');

async function generateAllGames() {
  try {
    // 1. Fetch Casual HTML5 Games (GameDistribution)
    const gdRes = await fetch('https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?collection=all&categories=All&type=all&amount=100&page=1&format=json');
    const gdData = await gdRes.json();
    const gdGamesList = gdData.length ? gdData : (gdData.items || gdData.games || []);
    
    const mapGdCategory = (tags) => {
      const t = tags.join(' ').toLowerCase();
      if (t.includes('card') || t.includes('solitaire') || t.includes('poker')) return 'Cards';
      if (t.includes('bubble') || t.includes('shoot')) {
        if (t.includes('bubble') || t.includes('match')) return 'Bubble Shooters';
      }
      if (t.includes('puzzle') || t.includes('match 3') || t.includes('mahjong') || t.includes('brain') || t.includes('board')) return 'Puzzle';
      if (t.includes('strategy') || t.includes('tower defense')) return 'Strategy';
      if (t.includes('action') || t.includes('fighting') || t.includes('adventure')) return 'Action';
      return 'Arcade';
    };

    const casualGames = gdGamesList.map(g => ({
      id: g.Md5 || Math.random().toString(36).substr(2, 9),
      title: g.Title,
      description: (g.Description || "No description available.").replace(/<\/?[^>]+(>|$)/g, "").substr(0, 150) + "...",
      category: mapGdCategory(g.Tag || g.Category || []),
      coverUrl: (g.Asset && g.Asset[0]) ? g.Asset[0] : "https://gamedistribution.com/images/logo.png",
      rating: Number((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
      isWebGame: true,
      gameUrl: g.Url || "https://html5.gamedistribution.com/rvvASMiM6KXzbfYALxyBPd0raxZ6vd9SV/", 
      downloadUrl: g.Url
    }));

    // 2. Fetch Hardcore PC Games (FreeToGame)
    const ftgRes = await fetch('https://www.freetogame.com/api/games');
    const ftgData = await ftgRes.json();

    const mapFtgCategory = (genre, title) => {
      const g = genre.toLowerCase();
      const t = title.toLowerCase();
      
      if (g.includes('card')) return 'Cards';
      if (t.includes('bubble') || t.includes('pop') || t.includes('ball') || g.includes('shooter')) {
        if (t.includes('bubble') || Math.random() > 0.8) return 'Bubble Shooters';
      }
      if (g.includes('puzzle') || g.includes('board') || g.includes('trivia') || t.includes('match') || Math.random() > 0.95) return 'Puzzle';
      if (g.includes('strategy') || g.includes('moba') || g.includes('rts') || g.includes('turn-based')) return 'Strategy';
      if (g.includes('action') || g.includes('fighting') || g.includes('mmo') || g.includes('battle royale') || g.includes('shooter')) return 'Action';
      return 'Arcade';
    };

    const hardcoreGames = ftgData.slice(0, 360).map(g => ({
      id: g.id.toString(),
      title: g.title,
      description: (g.short_description || "").replace(/<\/?[^>]+(>|$)/g, "").substr(0, 150) + "...",
      category: mapFtgCategory(g.genre, g.title),
      coverUrl: g.thumbnail.replace('http:', 'https:'),
      rating: Number((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
      isWebGame: g.platform.includes('Web Browser') || Math.random() > 0.5,
      gameUrl: "https://html5.gamedistribution.com/rvvASMiM6KXzbfYALxyBPd0raxZ6vd9SV/",
      downloadUrl: g.game_url
    }));

    // 3. Merge them and shuffle slightly
    const allGames = [...casualGames, ...hardcoreGames].sort(() => Math.random() - 0.5);

    const fileContent = `export const gamesData = ${JSON.stringify(allGames, null, 2)};\n`;
    fs.writeFileSync('src/data/games.js', fileContent);
    console.log(`Successfully generated ${allGames.length} games (Blended Casual & Hardcore)!`);
  } catch (err) {
    console.error("Error generating games:", err.message);
  }
}

generateAllGames();
