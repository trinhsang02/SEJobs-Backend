const bcrypt = require("bcrypt");

async function hashPassword() {
  const password = "Khoa1234.";
  const saltRounds = 10;

  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    console.log("Hashed password:", hashed);
  } catch (err) {
    console.error("Error hashing password:", err);
  }
}

hashPassword();
