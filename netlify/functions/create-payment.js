const axios = require("axios");

exports.handler = async (event) => {
  const { nomProduit, prixProduit } = JSON.parse(event.body);

  try {
    const response = await axios.post(
      "https://app.paydunya.com/api/v1/checkout-invoice/create",
      {
        invoice: {
          total_amount: prixProduit,
          description: nomProduit
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY,
          "PAYDUNYA-PUBLIC-KEY": process.env.PAYDUNYA_PUBLIC_KEY,
          "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.response?.data || error.message)
    };
  }
};