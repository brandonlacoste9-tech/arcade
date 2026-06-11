const fs = require('fs');

fetch('https://www.freetogame.com/api/games')
  .then(res => res.json())
  .then(data => {
    // Map genres to our UI categories
    const mapCategory = (genre) => {
      const g = genre.toLowerCase();
      if (g.includes('shooter') || g.includes('action') || g.includes('fighting') || g.includes('mmo') || g.includes('battle royale')) return 'Action';
      if (g.includes('strategy') || g.includes('moba') || g.includes('card')) return 'Strategy';
      if (g.includes('puzzle') || g.includes('board') || g.includes('trivia')) return 'Puzzle';
      return 'Arcade';
    };

    const formattedGames = data.slice(0, 192).map(g => ({
      id: g.id.toString(),
      title: g.title,
      description: g.short_description,
      category: mapCategory(g.genre),
      coverUrl: g.thumbnail.replace('http:', 'https:'),
      rating: Number((Math.random() * (5 - 3.8) + 3.8).toFixed(1)), // Fake rating between 3.8 and 5.0
      isWebGame: g.platform.includes('Web Browser') || Math.random() > 0.5, // Mixed web/desktop
      gameUrl: "https://html5.gamedistribution.com/rvvASMiM6KXzbfYALxyBPd0raxZ6vd9SV/", // GameDistribution mock
      downloadUrl: g.game_url
    }));

    const fileContent = `export const gamesData = ${JSON.stringify(formattedGames, null, 2)};\n`;
    fs.writeFileSync('src/data/games.js', fileContent);
    console.log(`Successfully generated ${formattedGames.length} games with REAL pictures!`);
  })
  .catch(err => console.error("Error:", err.message));
