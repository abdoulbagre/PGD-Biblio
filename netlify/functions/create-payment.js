exports.handler = async (event) => {
  const { nomProduit, prixProduit } = JSON.parse(event.body);

  try {
    const response = await fetch("https://app.paydunya.com/api/v1/checkout-invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY,
        "PAYDUNYA-PUBLIC-KEY": process.env.PAYDUNYA_PUBLIC_KEY,
        "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN
      },
      body: JSON.stringify({
        invoice: {
          total_amount: prixProduit,
          description: nomProduit
        }
      })
    });

    const data = await response.json();

    console.log("PAYDUNYA RESPONSE:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.log("ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erreur création paiement",
        details: error.message
      })
    };
  }
};