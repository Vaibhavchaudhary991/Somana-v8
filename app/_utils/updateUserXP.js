// utils/updateUserXP.js

import User from "@/app/_models/userModel";
import { getLevel, getBadge } from "@/app/_utils/xpSystem";

/**
 * Updates XP, level, badge, totalPosts, and creatorScore for a user
 */
export async function updateUserXP(userId, xpEarned) {
  const user = await User.findById(userId);
  if (!user) return;

  user.xp += xpEarned;
  user.totalPosts += 1;

  const newLevel = getLevel(user.xp);
  if (newLevel > user.level) {
    user.level = newLevel;
    user.badge = getBadge(newLevel);
  }

  user.creatorScore = user.xp + user.totalPosts * 10;

  await user.save();
}
