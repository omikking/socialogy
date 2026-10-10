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
 * Assign 12 unique words to each player. No two players share a word.
 * Returns a Map of playerId → string[] (12 words).
 */
export function assignWordsToPlayers(playerIds) {
  const pool = shuffle(getUniquePool());
  const wordsPerPlayer = 12;
  const totalNeeded = playerIds.length * wordsPerPlayer;

  if (pool.length < totalNeeded) {
    throw new Error(`Not enough words in pool. Need ${totalNeeded}, have ${pool.length}.`);
  }

  const assignments = new Map();
  let idx = 0;
  for (const pid of playerIds) {
    assignments.set(pid, pool.slice(idx, idx + wordsPerPlayer));
    idx += wordsPerPlayer;
  }
  return assignments;
}
