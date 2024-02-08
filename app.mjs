import fetch from "node-fetch";
import btoa from "btoa";

// Etapa 1: Autenticação
const username = "teste_fiqon";
const password = "senha@115#";

async function authenticate() {
  try {
    const basicAuth = "Basic " + btoa(`${username}:${password}`);

    const response = await fetch(
      "https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/autenticacao/57441afd5a59ccd4c62816683fcc8d665c42bb7b12857fc64a6cace4ababdc67f78c70b044",
      {
        method: "POST",
        headers: {
          Authorization: basicAuth,
        },
      }
    );
    const data = await response.json();
    const apiToken = data.api_token;
    console.log("API Token:", apiToken);
    return apiToken;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw error;
  }
}

authenticate()
  .then((apiToken) => {
    return getPillars(apiToken).then((allPillars) =>
      envioInfo(allPillars, apiToken)
    );
  })
  .then((result) => {
    console.log("Resultado do envio de informações:", result);
  })
  .catch((error) => {
    console.error(
      "Erro ao autenticar, obter pilares da cultura ou enviar informações:",
      error
    );
  });

async function getPillars(apiToken) {
  let allPillars = [];
  let currentPage = 0;
  try {
    while (currentPage <= 4) {
      const response = await fetch(
        `https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/listar_pilares/76b07f1dbf18eabde7b8e3611ab078daa0f34b094cc9856d20d6d0b15fb3b7a99f697e451d?page=${currentPage}&api_token=${apiToken}`
      );
      const data = await response.json();
      console.log("Dados da resposta:", data);

      const pillars = data.data;
      console.log("Pilar:", data.data);
      allPillars = allPillars.concat(pillars);
      if (!data.next_page) break;
      currentPage++;
    }

    console.log("Pilares da cultura:", allPillars);
    return allPillars;
  } catch (error) {
    console.error("Erro ao obter os pilares da cultura:", error);
    throw error;
  }
}

async function envioInfo(allPillars, apiToken) {
  try {
    const concatenatedPillars = allPillars.join(", ");

    const concatenatedPillarsBase64 = btoa(concatenatedPillars);

    const response = await fetch(
      "https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/envia_resposta/7b56940678e89802e02e1981a8657206d639f657d4c58efb8d8fb74814799d1c001ec121c6",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ answer: concatenatedPillarsBase64 }),
      }
    );
    const data = await response.json();
    console.log(concatenatedPillarsBase64);
    console.log("Resposta do envio de informações:", data);
    return data;
  } catch (error) {
    console.error("Erro no envio de informações:", error);
    throw error;
  }
}
