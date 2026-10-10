import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load the curated everyday word pool EXCLUSIVELY from wordPool_everyday.ts.
 * Does NOT use wordPool.ts.
 */
function loadWordPoolFromSource() {
  const tsPath = path.join(__dirname, "wordPool_everyday.ts");
  const jsPath = path.join(__dirname, "wordPool_everyday.js");

  const targetFile = fs.existsSync(tsPath) ? tsPath : fs.existsSync(jsPath) ? jsPath : null;

  if (targetFile) {
    try {
      const content = fs.readFileSync(targetFile, "utf8");
      const startIdx = content.indexOf("[");
      const endIdx = content.lastIndexOf("]");
      if (startIdx !== -1 && endIdx !== -1) {
        const arrayStr = content.slice(startIdx, endIdx + 1);
        const parsed = new Function("return " + arrayStr)();
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep wordPool_everyday.js synchronized if needed for direct JS imports
          if (!fs.existsSync(jsPath) && fs.existsSync(tsPath)) {
            try {
              fs.writeFileSync(jsPath, content, "utf8");
            } catch {}
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn("[wordDatabase] Could not parse wordPool_everyday.ts:", err.message);
    }
  }

  return [];
}

export const wordPool = loadWordPoolFromSource();

/**
 * Remove duplicates from the word pool (case-insensitive).
 */
export function getUniquePool() {
  const seen = new Set();
  const unique = [];
  for (const word of wordPool) {
    if (typeof word === "string" && word.trim()) {
      const lower = word.trim().toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        unique.push(word.trim());
      }
    }
  }
  return unique;
}

/**
 * Shuffle an array using Fisher-Yates algorithm.
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Assign 30 words to each player based on cardDistribution mode.
 * - "SAME_30": Everyone gets the exact same 30 words.
 * - "DIFFERENT_30": Each player gets 30 unique/different words.
 * Returns a Map of playerId → string[] (30 words).
 */
export function assignWordsToPlayers(playerIds, cardDistribution = "SAME_30", wordsPerPlayer = 30) {
  const pool = shuffle(getUniquePool());

  if (cardDistribution === "SAME_30") {
    if (pool.length < wordsPerPlayer) {
      throw new Error(`Not enough words in pool. Need ${wordsPerPlayer}, have ${pool.length}.`);
    }
    const sameWords = pool.slice(0, wordsPerPlayer);
    const assignments = new Map();
    for (const pid of playerIds) {
      assignments.set(pid, [...sameWords]);
    }
    return assignments;
  } else {
    const totalNeeded = playerIds.length * wordsPerPlayer;
    if (pool.length < totalNeeded) {
      // Fallback if pool is smaller than totalNeeded: reuse pool cleanly
      const assignments = new Map();
      let idx = 0;
      for (const pid of playerIds) {
        const words = [];
        for (let i = 0; i < wordsPerPlayer; i++) {
          words.push(pool[(idx + i) % pool.length]);
        }
        assignments.set(pid, words);
        idx += wordsPerPlayer;
      }
      return assignments;
    }

    const assignments = new Map();
    let idx = 0;
    for (const pid of playerIds) {
      assignments.set(pid, pool.slice(idx, idx + wordsPerPlayer));
      idx += wordsPerPlayer;
    }
    return assignments;
  }
}
