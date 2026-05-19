const boutons = document.querySelectorAll(".payerBtn");

boutons.forEach((bouton) => {
  bouton.addEventListener("click", async () => {

    const nomProduit = bouton.dataset.nom;
    const prixProduit = bouton.dataset.prix;

    try {

      const response = await fetch(
        "/.netlify/functions/create-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nomProduit,
            prixProduit
          })
        }
      );

      const data = await response.json();

      console.log(data);

      // Moneroo renvoie souvent une URL de paiement
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Erreur création paiement");
      }

    } catch (error) {
      console.log(error);
      alert("Erreur connexion serveur");
    }

  });
});