import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import migrator from "models/migrator.js";
import authorization from "models/authorization.js";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .get(controller.canRequest("read:migration"), getHandler)
  .post(controller.canRequest("create:migration"), postHandler)
  .handler(controller.errorHandlers);

async function getHandler(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();

  const secureOutputValues = authorization.filterOutput(
    req.context.user,
    "read:migration",
    pendingMigrations,
  );

  return res.status(200).json(secureOutputValues);
}

async function postHandler(req, res) {
  const migratedMigrations = await migrator.runPendingMigrations();

  const secureOutputValues = authorization.filterOutput(
    req.context.user,
    "read:migration",
    migratedMigrations,
  );

  if (migratedMigrations.length > 0) {
    return res.status(201).json(secureOutputValues);
  }

  return res.status(200).json(secureOutputValues);
}
