const boutons = document.querySelectorAll(".payerBtn");

boutons.forEach((bouton) => {

  bouton.addEventListener("click", async () => {

    const nomProduit = bouton.dataset.nom?.trim();
    const prixProduit = Number(bouton.dataset.prix);

    // Validation
    if (!nomProduit || Number.isNaN(prixProduit) || prixProduit <= 0) {

      alert("Produit ou prix invalide");
      return;
    }

    // Sauvegarde texte bouton
    const ancienTexte = bouton.innerText;

    try {

      // Désactive bouton
      bouton.disabled = true;
      bouton.innerText = "Chargement...";

      // Requête backend
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

      // Parse réponse
      const data = await response.json();

      console.log("API RESPONSE:", data);

      // Vérifie erreur HTTP
      if (!response.ok) {

        throw new Error(
          data.error ||
          "Erreur serveur Netlify"
        );
      }

      // Compatibilité multi API
      const redirectUrl =

        data.checkout_url ||

        data.payment_url ||

        data.redirect_url ||

        data.invoice_url ||

        data?.data?.checkout_url;

      // Vérifie lien
      if (!redirectUrl) {

        console.error("Réponse complète :", data);

        throw new Error(
          "Lien de paiement introuvable"
        );
      }

      // Redirection paiement
      window.location.href = redirectUrl;

    } catch (error) {

      console.error("PAYMENT ERROR:", error);

      alert(
        error.message ||
        "Erreur de connexion serveur"
      );

    } finally {

      // Réactive bouton
      bouton.disabled = false;
      bouton.innerText = ancienTexte;
    }
  });
});