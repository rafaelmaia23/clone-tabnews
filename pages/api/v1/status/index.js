import database from "infra/database.js";

async function status(req, res) {
  const result = await database.query("SELECT 1 + 1 AS SUM;");
  console.log(result);
  res.status(200).json({ status: "ok" });
}

export default status;
