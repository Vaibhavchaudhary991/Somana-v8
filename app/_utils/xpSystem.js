export const XP_ACTIONS = {
  BLOG_POST: 25, // Blog gives most, but not overpowered
  PODCAST_UPLOAD: 18, // Podcast gets medium XP
  MUSIC_UPLOAD: 15, // Music slightly less
  COMMENT: 5, // Light reward to encourage engagement
};

// XP needed to level up grows exponentially
// Formula: requiredXp = 150 * (level ^ 1.5)
export function getLevel(xp) {
  let level = 1;
  let requiredXp = Math.floor(150 * Math.pow(level, 1.5));

  while (xp >= requiredXp) {
    xp -= requiredXp;
    level++;
    requiredXp = Math.floor(150 * Math.pow(level, 1.5));
  }

  return level;
}

export function getBadge(level) {
  if (level >= 50) return "Legendary";
  if (level >= 40) return "Mastermind";
  if (level >= 30) return "Pro Creator";
  if (level >= 20) return "Rising Star";
  if (level >= 10) return "Contributor";
  return "Newbie";
}
