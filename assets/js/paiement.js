const boutons = document.querySelectorAll(".payerBtn");

boutons.forEach((bouton) => {
  bouton.addEventListener("click", async () => {
    const nomProduit = bouton.dataset.nom || "";
    const prixProduit = Number(bouton.dataset.prix);

    if (!nomProduit || Number.isNaN(prixProduit)) {
      alert("Produit ou prix invalide");
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nomProduit,
          prixProduit
        })
      });

      if (!response.ok) {
        throw new Error("Erreur serveur Netlify Function");
      }

      const data = await response.json();
      console.log("Réponse API :", data);

      // support multi API (Moneroo / PayDunya / autre)
      const redirectUrl =
        data.checkout_url ||
        data.payment_url ||
        data.redirect_url ||
        data.invoice_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        alert("Lien de paiement introuvable");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur connexion serveur");
    }
  });
});