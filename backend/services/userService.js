// services/userService.js
const db = require("../config/db");

exports.checkUserExists = async (username, email) => {
  const [existingUsername] = await db
    .promise()
    .query("SELECT * FROM account WHERE username = ?", [username]);
  const [existingUser] = await db
    .promise()
    .query("SELECT * FROM account WHERE email = ?", [email]);

  return { existingUsername, existingUser };
};
