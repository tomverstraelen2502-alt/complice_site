/* =====================================================================
   COMPLICE — page d'une création (produit.html#col, produit.html#manchettes…)
   Le contenu vient de produits.js
   ===================================================================== */
(function () {
  "use strict";
  const { $, esc, euro, produit } = C;
  const id = decodeURIComponent(location.hash.slice(1)) || new URLSearchParams(location.search).get("id");
  // une autre création choisie depuis cette page : on recharge son contenu
  window.addEventListener("hashchange", () => location.reload());
  const p = produit(id);

  if (!p || p.bientot) {
    $("#fiche").innerHTML = `<section class="section"><div class="wrap"><h1 class="title">${p ? esc(p.nom) + " arrivent bientôt" : "Création introuvable"}</h1>
      <p>${p ? "Les photos sont en préparation. Suivez-nous sur Instagram pour les voir en premier." : "Cette page n'existe pas ou plus."}</p>
      <p style="margin-top:22px"><a class="btn btn-olive" href="index.html#creations">Voir les créations</a></p></div></section>`;
    $("#autres").innerHTML = C.enVente().map(C.vignette).join("");
    return;
  }

  document.title = `${p.nom} · Complice`;

  // couleur(s) choisie(s) : la première en stock par défaut
  const premiere = (q) => (q.couleurs.find((c) => c.stock > 0) || q.couleurs[0]).nom;
  const parts = C.parties(p);
  let choix = p.composants ? Object.fromEntries(parts.map((pt) => [pt.cle, C.premiereOpt(pt)])) : premiere(p);

  const swatches = (opts, sel, cle) => `<div class="swatches">${opts.map((o) =>
    `<button type="button" class="swatch" data-cle="${esc(cle)}" data-couleur="${esc(o.val)}" aria-pressed="${o.val === sel}"><i style="background:${esc(o.hex)}"></i>${esc(o.label)}</button>`).join("")}</div>`;
  const choixCouleurs = () => p.composants
    ? parts.map((pt) => `<div><p class="label">${esc(pt.nom)}</p>${swatches(pt.opts, choix[pt.cle], pt.cle)}</div>`).join("")
    : `<div><p class="label">Couleur</p>${swatches(p.couleurs.map((c) => ({ val: c.nom, label: c.nom, hex: c.hex })), choix, "")}</div>`;
  const statut = () => { const d = C.dispo(p, choix); return `<p class="status ${d.cls}" id="statut">${esc(d.txt)}</p>`; };

  const pieces = parts.reduce((s, pt) => s + (pt.prix || 0), 0);

  $("#fiche").innerHTML = `
    <section class="product" aria-labelledby="titre">
      <div class="carousel" data-car>
        <div class="track" tabindex="0" aria-label="Photos : ${esc(p.nom)}">
          ${p.photos.map((ph, i) => `<figure class="slide"><img src="${esc(ph.src)}" alt="${esc(ph.alt)}" ${i > 1 ? 'loading="lazy"' : ""} decoding="async"></figure>`).join("")}
        </div>
        <div class="wrap car-ui">
          <div class="dots">${p.photos.map((_, i) => `<button type="button" aria-label="Photo ${i + 1}" ${i === 0 ? 'aria-current="true"' : ""}></button>`).join("")}</div>
          <div class="arrows"><button type="button" data-dir="-1" aria-label="Photo précédente">←</button><button type="button" data-dir="1" aria-label="Photo suivante">→</button></div>
        </div>
      </div>
      <div class="wrap info">
        <div class="menu-line"><h1 id="titre">${esc(p.nom)}</h1><span class="menu-price${p.prix == null ? " ask" : ""}">${C.prixTxt(p.prix)}</span></div>
        <div>
          <p class="accroche">${esc(p.accroche)}</p>
          <p class="desc">${esc(p.description)}</p>
          ${p.prix != null && pieces > p.prix ? `<p class="saving-line">Au lieu de ${euro(pieces)} séparément.</p>` : ""}
          <ul class="details">${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        </div>
        <div class="buy">
          <div id="couleurs" class="buy">${choixCouleurs()}</div>
          ${statut()}
          <div><button class="btn btn-olive" type="button" id="ajouter">Ajouter à ma commande</button></div>
        </div>
      </div>
    </section>`;

  C.carrousel($("[data-car]"));

  $("#couleurs").addEventListener("click", (e) => {
    const b = e.target.closest(".swatch");
    if (!b) return;
    if (p.composants) choix = { ...choix, [b.dataset.cle]: b.dataset.couleur }; else choix = b.dataset.couleur;
    b.parentElement.querySelectorAll(".swatch").forEach((s) => s.setAttribute("aria-pressed", String(s === b)));
    $("#statut").outerHTML = statut();
  });

  $("#ajouter").addEventListener("click", () => {
    C.ajouter(p.id, choix);
    C.toast(`${esc(p.nom)} ajouté · <a href="index.html#commander">Voir ma commande</a>`);
  });

  $("#autres").innerHTML = [...C.enVente().filter((x) => x.id !== p.id), ...PRODUITS.filter((x) => x.bientot)].map(C.vignette).join("");
})();
