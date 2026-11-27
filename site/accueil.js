/* =====================================================================
   COMPLICE — page d'accueil : défilé, vignettes, commande
   ===================================================================== */
(function () {
  "use strict";
  const { $, esc, euro, calme, produit, enVente } = C;


  /* Défilé de photos (liste doublée pour tourner sans coupure) */
  const recentes = [...enVente()].reverse().flatMap((p) => p.photos);   // dernières créations d'abord
  const extra = (typeof DEFILE !== "undefined" ? DEFILE : []).map((src) => ({ src, alt: "" }));
  const photos = [...new Map([...extra, ...recentes].map((ph) => [ph.src, ph])).values()];
  $("#strip").style.animationDuration = Math.max(70, photos.length * 4) + "s";
  const tuile = (ph) => `<img src="${esc(ph.src)}" alt="" loading="lazy" decoding="async">`;
  $("#strip").innerHTML = photos.map(tuile).join("") + (calme ? "" : photos.map(tuile).join(""));

  /* Vignettes des créations : en vente d'abord, puis « bientôt » */
  const liste = [...enVente(), ...PRODUITS.filter((p) => p.bientot)];
  $("#cards").innerHTML = liste.map(C.vignette).join("");
  const n = enVente().length;
  $("#nbCrea").textContent = `${n} disponible${n > 1 ? "s" : ""}`;

  /* Pelotes : les couleurs déjà crochetées */
  const vues = [...new Map(enVente().filter((p) => p.couleurs).flatMap((p) => p.couleurs).map((c) => [c.hex.toLowerCase(), c])).values()];
  $("#pelotes").innerHTML = vues.slice(0, 11).map((c) => `<div class="pelote"><i style="background-color:${esc(c.hex)}"></i>${esc(c.nom)}</div>`).join("")
    + `<a class="pelote plus" href="${esc(BOUTIQUE.nuancier)}" target="_blank" rel="noopener"><i>+</i>Et bien d'autres</a>`;
  document.querySelectorAll(".nuancier-link").forEach((a) => (a.href = BOUTIQUE.nuancier));

  /* ---------- Commande ---------- */
  let lignes = C.lire();

  function dessiner() {
    $("#vide").hidden = lignes.length > 0;
    $("#lines").innerHTML = lignes.map((x, i) => {
      const p = produit(x.id);
      const d = C.dispo(p, x.choix);
      return `<div class="line">
        <div class="line-name"><a href="produit.html#${encodeURIComponent(p.id)}">${esc(C.libelle(x))}</a><small>${C.prixTxt(p.prix)} · ${d.cls === "in" ? "prêt à partir" : "sur commande"}</small></div>
        <div class="stepper"><button type="button" data-i="${i}" data-d="-1" aria-label="Retirer une pièce">−</button><output>${x.qte}</output><button type="button" data-i="${i}" data-d="1" aria-label="Ajouter une pièce">+</button></div>
      </div>`;
    }).join("");
    total();
  }
  function total() {
    const n = lignes.reduce((s, x) => s + x.qte, 0);
    const sous = lignes.reduce((s, x) => s + x.qte * (produit(x.id).prix || 0), 0);
    const surDemande = lignes.some((x) => produit(x.id).prix == null);
    $("#total").textContent = euro(sous);
    if (surDemande && !sous) $("#total").textContent = "Sur demande";
    $("#sumNote").textContent = !n ? "" : (surDemande ? "Certaines pièces sont à prix sur demande : nous vous confirmons le total quand on vous contacte. " : "") + "Couleurs, remise et paiement : on s'arrange ensemble par message ou par e-mail.";
    $("#fCommande").value = lignes.map((x) => `${x.qte} × ${C.libelle(x)} — ${produit(x.id).prix == null ? "prix sur demande" : euro(x.qte * produit(x.id).prix)}${C.dispo(produit(x.id), x.choix).cls === "in" ? "" : " — sur commande"}`).join("\n");
    $("#fTotal").value = euro(sous);
  }
  $("#lines").addEventListener("click", (e) => {
    const b = e.target.closest("[data-d]");
    if (!b) return;
    const x = lignes[+b.dataset.i];
    x.qte = Math.min(10, x.qte + Number(b.dataset.d));
    if (x.qte < 1) lignes.splice(+b.dataset.i, 1);
    C.ecrire(lignes);
    dessiner();
  });

  const form = $("#orderForm");

  /* E-mail de confirmation au client (EmailJS). Ne bloque jamais la commande. */
  async function confirmationClient(d) {
    const e = BOUTIQUE.emailjs || {};
    if (!e.clePublique || !e.service || !e.modele || !d.email) return;
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: e.service, template_id: e.modele, user_id: e.clePublique,
          template_params: { nom: d.nom || "", email: d.email, commande: d.commande || "", total: d.total || "" }
        })
      });
    } catch (_) { /* la commande est déjà envoyée : on n'affiche pas d'erreur */ }
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#error").textContent = "";
    if (!lignes.length) { $("#error").textContent = "Ajoutez au moins une création à votre commande."; return; }
    const btn = $("#submit");
    btn.disabled = true; btn.textContent = "Envoi…";
    try {
      if (!BOUTIQUE.cleFormulaire) throw new Error("clé Web3Forms manquante dans produits.js");
      const donnees = Object.fromEntries(new FormData(form));
      if (donnees.botcheck) return;                         // robot détecté
      delete donnees.botcheck;
      const rep = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: BOUTIQUE.cleFormulaire,
          subject: `Nouvelle commande Complice — ${donnees.nom || ""}`,
          from_name: "Site Complice",
          replyto: donnees.email,
          ...donnees
        })
      });
      const res = await rep.json().catch(() => ({}));
      if (!rep.ok || res.success === false) throw new Error(res.message || rep.status);
      await confirmationClient(donnees);
      try { sessionStorage.setItem("commande", $("#fCommande").value + "\nTotal : " + $("#fTotal").value); } catch (_) {}
      C.ecrire([]);
      location.href = "merci.html";
    } catch (_) {
      $("#error").textContent = `L'envoi n'a pas fonctionné. Réessayez, ou écrivez-nous sur Instagram @${BOUTIQUE.instagram} ou à ${BOUTIQUE.email}.`;
      btn.disabled = false; btn.textContent = "Envoyer ma commande";
    }
  });

  // si la commande change dans un autre onglet (page produit), on la relit
  window.addEventListener("storage", () => { lignes = C.lire(); dessiner(); C.majCompteur(lignes); });
  window.addEventListener("pageshow", () => { lignes = C.lire(); dessiner(); C.majCompteur(lignes); });

  dessiner();
})();
