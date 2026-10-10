import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default built-in categories data
const defaultCategories = {
  "Animals": [
    "Tiger", "Lion", "Cheetah", "Leopard", "Wolf", "Bear", "Elephant",
    "Giraffe", "Zebra", "Kangaroo", "Panda", "Koala", "Gorilla", "Fox",
    "Crocodile", "Eagle", "Falcon", "Owl", "Dolphin", "Whale", "Shark"
  ],
  "Food & Dishes": [
    "Pizza", "Burger", "Pasta", "Sushi", "Tacos", "Ramen", "Lasagna",
    "Sandwich", "Salad", "Steak", "Ice Cream", "Pancakes", "Waffles",
    "Dumplings", "Burrito", "Curry", "Biryani", "French Fries", "Donut"
  ],
  "Movies & TV": [
    "Inception", "Titanic", "Avatar", "Harry Potter", "Star Wars",
    "Avengers", "The Matrix", "Interstellar", "Jaws", "Jurassic Park",
    "Game of Thrones", "Breaking Bad", "Stranger Things", "The Dark Knight"
  ],
  "Countries & Cities": [
    "Japan", "France", "Italy", "Brazil", "Canada", "Australia", "India",
    "Egypt", "Spain", "Germany", "New York", "Paris", "Tokyo", "London",
    "Rome", "Sydney", "Dubai", "Berlin", "Toronto", "Venice"
  ],
  "Superheroes": [
    "Spider-Man", "Batman", "Superman", "Iron Man", "Thor", "Captain America",
    "Wonder Woman", "Wolverine", "Flash", "Black Panther", "Hulk", "Doctor Strange"
  ],
  "Technology & Gadgets": [
    "Smartphone", "Laptop", "Smartwatch", "Headphones", "Drone", "VR Headset",
    "Camera", "Tablet", "Gaming Console", "Robot", "Microphone", "Smart Speaker"
  ],
  "Sports & Games": [
    "Football", "Basketball", "Tennis", "Cricket", "Baseball", "Golf",
    "Volleyball", "Chess", "Poker", "Swimming", "Boxing", "Formula 1"
  ],
  "Everyday Objects": [
    "Backpack", "Sunglasses", "Umbrella", "Water Bottle", "Clock", "Keyring",
    "Wallet", "Notebook", "Toothbrush", "Scissors", "Lamp", "Headphones"
  ]
};

/**
 * Loads categories from optional custom 'category.js' or 'category.json' file in server dir if it exists,
 * otherwise falls back to defaultCategories.
 */
function loadCategories() {
  const customJsPath = path.join(__dirname, "category.js");
  const customJsonPath = path.join(__dirname, "category.json");

  if (fs.existsSync(customJsPath)) {
    try {
      const content = fs.readFileSync(customJsPath, "utf8");
      // If it exports default or module.exports or plain JSON/Object
      const match = content.match(/(\{[\s\S]*\})/);
      if (match) {
        const parsed = new Function("return " + match[1])();
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
          console.log("[Categories] Successfully loaded custom categories from category.js");
          return { ...defaultCategories, ...parsed };
        }
      }
    } catch (err) {
      console.warn("[Categories] Error reading custom category.js:", err.message);
    }
  }

  if (fs.existsSync(customJsonPath)) {
    try {
      const content = fs.readFileSync(customJsonPath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        console.log("[Categories] Successfully loaded custom categories from category.json");
        return { ...defaultCategories, ...parsed };
      }
    } catch (err) {
      console.warn("[Categories] Error reading custom category.json:", err.message);
    }
  }

  return defaultCategories;
}

export function getAllCategories() {
  const categoriesMap = loadCategories();
  return Object.keys(categoriesMap).map((name) => ({
    name,
    count: categoriesMap[name].length,
  }));
}

export function pickCategoryWords(selectedCategoryName = null) {
  const categoriesMap = loadCategories();
  const availableCategories = Object.keys(categoriesMap);
  
  let categoryName = selectedCategoryName;
  if (!categoryName || categoryName === "Random" || !categoriesMap[categoryName]) {
    categoryName = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  }

  const wordList = categoriesMap[categoryName];
  if (!wordList || wordList.length < 2) {
    throw new Error(`Category "${categoryName}" does not have enough words (at least 2 required).`);
  }

  // Pick 2 random distinct words from the category
  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  const mainWord = shuffled[0];
  const imposterWord = shuffled[1];

  return {
    categoryName,
    mainWord,
    imposterWord,
  };
}
