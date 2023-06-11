const fs = require("fs");

const filePath = "app/fb.js";

function checkFirebaseConfig() {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const firebaseConfigRegex = /const firebaseConfig = {([\s\S]*?)}/m;
  const firebaseConfigMatch = fileContent.match(firebaseConfigRegex);

  if (!firebaseConfigMatch) {
    console.error("firebaseConfig object not found in file");
    process.exit(1);
  }

  const firebaseConfigString = firebaseConfigMatch[1];
  const keyValuesRegex = /([\w-]+)\s*:\s*['"](.+?)['"]/g;
  let match;
  const firebaseConfig = {};

  while ((match = keyValuesRegex.exec(firebaseConfigString))) {
    const key = match[1];
    const value = match[2];
    firebaseConfig[key] = value;
  }

  const invalidKeys = [];

  for (const key in firebaseConfig) {
    if (firebaseConfig[key]) {
      invalidKeys.push(key);
    }
  }

  if (invalidKeys.length > 0) {
    console.error(`Firebase config keys not cleared before commit`);
    process.exit(1);
  }
}

checkFirebaseConfig();
