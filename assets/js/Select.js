const id=new URLSearchParams(location.search).get("id");
const p=dataSet.find(x=>x.id==id);
document.getElementById("image-Produit").src=p.image;
document.getElementById("titreProduit").textContent=p.nom;
document.getElementById("descriptionProduit").textContent=p.description;
document.getElementById("prixProduit").textContent=p.prix;
document.querySelector(".payerBtn").dataset.nom = p.nom;
document.querySelector(".payerBtn").dataset.prix = p.prix;
