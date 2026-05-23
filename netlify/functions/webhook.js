exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  console.log("Paiement reçu:", body);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "OK" })
  };
};