export const handler = async (event) => {

  const { nomProduit, prixProduit } =
    JSON.parse(event.body || "{}");

  try {

    const response = await fetch(
      "https://api.moneroo.io/v1/payments/initiate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${process.env.MONEROO_SECRET_KEY}`
        },

        body: JSON.stringify({

          amount: Number(prixProduit),

          currency: "XOF",

          description: nomProduit,

          return_url:
            "https://pgd-biblio.netlify.app/success",

          callback_url:
            "https://pgd-biblio.netlify.app/.netlify/functions/webhook",

          customer: {
            name: "Client"
          }

        })
      }
    );

    const data = await response.json();

    console.log("MONEROO RESPONSE:", data);

    return {
      statusCode: 200,

      body: JSON.stringify(data)
    };

  } catch (error) {

    console.log("ERROR:", error);

    return {
      statusCode: 500,

      body: JSON.stringify({
        error: error.message
      })
    };
  }
};