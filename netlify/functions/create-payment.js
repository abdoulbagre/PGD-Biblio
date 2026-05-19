exports.handler = async (event) => {

  const { nomProduit, prixProduit } = JSON.parse(event.body || "{}");

  if (!nomProduit || !prixProduit) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Données manquantes" })
    };
  }

  try {

    const response = await fetch(
      "https://api.moneroo.io/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MONEROO_API_KEY}`
        },

        body: JSON.stringify({
          amount: parseInt(prixProduit, 10),
          currency: "XOF",
          description: nomProduit,

          return_url: "https://pgd-market.netlify.app/succes.html",
          cancel_url: "https://pgd-market.netlify.app/annule.html",
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        checkout_url: data.checkout_url
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};