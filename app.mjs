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

// Chame a função authenticate
authenticate()
  .then((apiToken) => {
    return getPillars(apiToken);
  })
  .then((pillars) => {
    console.log("Pilares da cultura:", pillars);
    // Faça o que você precisa com os pilares da cultura aqui
  })
  .catch((error) => {
    console.error("Erro ao autenticar ou obter pilares da cultura:", error);
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
      /*if (data === null || data === "") {
        break;
      }*/
      const pillars = data.pillars;
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

// envio das informações

getPillars()
  .then((allPillars) => {
    return envioInfo(allPillars); // Passando allPillars como parâmetro
  })
  .catch((error) => {
    console.error("Erro ao autenticar ou obter pilares da cultura:", error);
  });

async function envioInfo(allPillars) {
  try {
    const allPillars64 = btoa(JSON.stringify(allPillars)); // Convertendo para base64

    const response = await fetch(
      "https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/envia_resposta/7b56940678e89802e02e1981a8657206d639f657d4c58efb8d8fb74814799d1c001ec121c6",
      {
        method: "POST",
        headers: {
          answer: allPillars64,
        },
      }
    );
    const data = await response.json();
    const apiToken = data.api_token;
    console.log("all pillars base 64: ", allPillars64);
    return allPillars64;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw error;
  }
}
