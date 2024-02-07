import fetch from "node-fetch";

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
authenticate();
