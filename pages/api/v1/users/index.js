import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import activation from "models/activation";
import authorization from "models/authorization.js";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:user"), postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(req, res) {
  const userInputValue = req.body;
  const newUser = await user.create(userInputValue);

  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken);

  const secureOutputValues = authorization.filterOutput(
    req.context.user,
    "read:user",
    newUser,
  );

  return res.status(201).json(secureOutputValues);
}
