export const handler = async (event) => {

  try {

    // Vérifie que la requête est POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          error: "Méthode non autorisée"
        })
      };
    }

    // Parse sécurisé
    const body = JSON.parse(event.body || "{}");

    const nomProduit = body.nomProduit;
    const prixProduit = Number(body.prixProduit);

    // Validation
    if (!nomProduit || !prixProduit) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Produit ou prix manquant"
        })
      };
    }

    // Requête Moneroo
    const response = await fetch(
      "https://api.moneroo.io/v1/payments/initialize",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",

          Authorization:
            `Bearer ${process.env.MONEROO_SECRET_KEY}`
        },

        body: JSON.stringify({

          amount: prixProduit,

          currency: "XOF",

          description: nomProduit,

          return_url:
            "https://pgd-market.netlify.app/success.html",
          
          cancel_url:
            "https://pgd-market.netlify.app/annule.html",

          callback_url:
            "https://pgd-market.netlify.app/.netlify/functions/webhook",

          customer: {
            first_name: "Client",
            last_name: "PGD",
            email: "client@example.com"
          },

          metadata: {
            produit: nomProduit
          }

        })
      }
    );

    // Réponse API
    const data = await response.json();

    console.log("MONEROO RESPONSE:", data);

    // Vérifie si Moneroo retourne une erreur
    if (!response.ok) {

      return {
        statusCode: response.status,

        body: JSON.stringify({
          error: data.message || "Erreur Moneroo",
          details: data
        })
      };
    }

    // Vérifie checkout_url
    const checkoutUrl = data?.data?.checkout_url;

    if (!checkoutUrl) {

      return {
        statusCode: 500,

        body: JSON.stringify({
          error: "Lien de paiement introuvable",
          details: data
        })
      };
    }

    // Succès
    return {
      statusCode: 200,

      body: JSON.stringify({

        success: true,

        paymentId: data.data.id,

        checkout_url: checkoutUrl
      })
    };

  } catch (error) {

    console.error("SERVER ERROR:", error);

    return {
      statusCode: 500,

      body: JSON.stringify({
        error: error.message
      })
    };
  }
};