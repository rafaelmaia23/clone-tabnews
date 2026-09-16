import useSWR from "swr";
import DefaultLayout from "interface/DefaultLayout";
import { Banner, Heading, Stack } from "@primer/react";
import { Card } from "@primer/react/experimental";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <DefaultLayout contentWidth="medium">
      <Stack gap="spacious">
        <Heading>Status</Heading>
        <UpdatedAt />
        <DatabaseStatus />
      </Stack>
    </DefaultLayout>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 10000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <Banner variant="info" layout="compact">
      <Banner.Title>Última atualização: {updatedAtText}</Banner.Title>
    </Banner>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 10000,
  });

  if (isLoading || !data) {
    return;
  }

  const database = data.dependencies.database;
  const openedConnections = database.opened_connections;
  const maxConnections = database.max_connections;
  const version = database.version ?? "-";

  return (
    <Stack>
      <Heading as="h2" variant="medium">
        Database
      </Heading>
      <Stack direction={{ narrow: "vertical", regular: "horizontal" }}>
        <Stack.Item grow>
          <Card>
            <Card.Heading>Conexões abertas</Card.Heading>
            <Card.Description>{openedConnections}</Card.Description>
            <Card.Metadata>uso nesse instante</Card.Metadata>
          </Card>
        </Stack.Item>
        <Stack.Item grow>
          <Card>
            <Card.Heading>Conexões máximas</Card.Heading>
            <Card.Description>{maxConnections}</Card.Description>
            <Card.Metadata>conexões disponíveis</Card.Metadata>
          </Card>
        </Stack.Item>
        <Stack.Item grow>
          <Card>
            <Card.Heading>PostgreSQL</Card.Heading>
            <Card.Description>{version}</Card.Description>
            <Card.Metadata>versão em execução</Card.Metadata>
          </Card>
        </Stack.Item>
      </Stack>
    </Stack>
  );
}
