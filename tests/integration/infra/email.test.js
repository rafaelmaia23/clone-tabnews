import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Rafael <rafael@example.com>",
      to: "Teste <teste@example.com>",
      subject: "Teste",
      text: "Este é um email de teste.",
    });

    await email.send({
      from: "Rafael <rafael@example.com>",
      to: "Teste <teste@example.com>",
      subject: "Ultimo email",
      text: "Este é o ultimo email de teste.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<rafael@example.com>");
    expect(lastEmail.recipients[0]).toBe("<teste@example.com>");
    expect(lastEmail.subject).toBe("Ultimo email");
    expect(lastEmail.text).toBe("Este é o ultimo email de teste.\r\n");
  });
});
