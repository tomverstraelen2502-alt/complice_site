/* =====================================================================
   COMPLICE — outils communs à toutes les pages
   (commande gardée dans le navigateur, prix, stock, pied de page)
   ===================================================================== */
const C = (function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const euro = (n) => (Number(n) || 0).toLocaleString("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const produit = (id) => PRODUITS.find((p) => p.id === id);
  const enVente = () => PRODUITS.filter((p) => !p.bientot);
  const prixTxt = (n) => (n == null ? "Prix sur demande" : euro(n));

  function toast(html) {
    const t = $("#toast");
    if (!t) return;
    t.innerHTML = html; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 3200);
  }

  const court = (nom) => nom.replace(/^(Le |Les |La |L')/, "");
  /* Les pièces d'un ensemble. Un composant est soit l'id d'une création,
     soit un choix entre plusieurs créations : { cle, nom, choix: ["id1", "id2"] } */
  function parties(p) {
    return (p.composants || []).map((c) => {
      if (typeof c === "string") {
        const q = produit(c);
        return { cle: c, nom: q.nom, prix: q.prix, opts: q.couleurs.map((k) => ({ val: k.nom, label: k.nom, hex: k.hex, stock: k.stock })) };
      }
      const qs = c.choix.map(produit);
      return { cle: c.cle, nom: c.nom, prix: qs[0].prix, opts: qs.flatMap((q) => q.couleurs.map((k) => ({ val: q.id + "|" + k.nom, label: `${court(q.nom).replace(new RegExp("^" + court(c.nom) + " ", "i"), "")} · ${k.nom}`, hex: k.hex, stock: k.stock }))) };
    });
  }
  const optPar = (pt, val) => pt.opts.find((o) => o.val === val);
  const premiereOpt = (pt) => (pt.opts.find((o) => o.stock > 0) || pt.opts[0]).val;

  /* Disponibilité d'une couleur, ou d'un ensemble (prêt si toutes ses pièces le sont) */
  function dispo(p, choix) {
    if (p.composants) {
      const pret = parties(p).every((pt) => { const o = optPar(pt, choix && choix[pt.cle]); return o && o.stock > 0; });
      return pret ? { cls: "in", txt: "Prêt à partir" } : { cls: "made", txt: `Sur commande · ${BOUTIQUE.delai}` };
    }
    const c = p.couleurs.find((x) => x.nom === choix) || p.couleurs[0];
    return c.stock > 0
      ? { cls: "in", txt: c.stock === 1 ? "Une pièce prête à partir" : `${c.stock} pièces prêtes à partir` }
      : { cls: "made", txt: `Sur commande · ${BOUTIQUE.delai}` };
  }
  /* Résumé pour une vignette : prêt si au moins une couleur est en stock */
  function dispoResume(p) {
    if (p.bientot) return { cls: "soon", txt: "Bientôt" };
    if (p.composants) return dispo(p, Object.fromEntries(parties(p).map((pt) => [pt.cle, premiereOpt(pt)])));
    return p.couleurs.some((c) => c.stock > 0) ? { cls: "in", txt: "Prêt à partir" } : { cls: "made", txt: "Sur commande" };
  }

  /* ---------- La commande, gardée dans le navigateur ---------- */
  const CLE = "complice-commande";
  function lire() {
    let l = [];
    try { l = JSON.parse(localStorage.getItem(CLE) || "[]"); } catch (_) { l = []; }
    // on retire ce qui n'existe plus dans produits.js
    return l.filter((x) => { const p = produit(x.id); return p && !p.bientot && x.qte > 0 && (!p.composants || (x.choix && parties(p).every((pt) => optPar(pt, x.choix[pt.cle])))); });
  }
  function ecrire(l) { try { localStorage.setItem(CLE, JSON.stringify(l)); } catch (_) {} majCompteur(l); }
  const memeLigne = (a, b) => a.id === b.id && JSON.stringify(a.choix) === JSON.stringify(b.choix);
  function ajouter(id, choix) {
    const l = lire();
    const n = { id, choix, qte: 1 };
    const ex = l.find((x) => memeLigne(x, n));
    if (ex) ex.qte = Math.min(10, ex.qte + 1); else l.push(n);
    ecrire(l);
    return l;
  }
  function majCompteur(l = lire()) {
    const el = $("#count");
    if (!el) return;
    const n = l.reduce((s, x) => s + x.qte, 0);
    el.textContent = n; el.hidden = !n;
  }
  function libelle(x) {
    const p = produit(x.id);
    if (p.composants) return `${p.nom} (${parties(p).map((pt) => { const o = optPar(pt, x.choix[pt.cle]); return `${court(pt.nom).toLowerCase()} ${o ? o.label : "?"}`; }).join(", ")})`;
    return `${p.nom} (${x.choix})`;
  }

  /* ---------- Pied de page ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
    const m = $("#lnkMail"); if (m) m.textContent = BOUTIQUE.email;
    const i = $("#lnkInsta");
    if (i && BOUTIQUE.instagram) {
      i.href = "https://www.instagram.com/" + BOUTIQUE.instagram + "/";
      i.innerHTML = `<svg class="insta-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.4"/><circle class="dot" cx="17.6" cy="6.4" r="1.2"/></svg>${esc(BOUTIQUE.instagram)}`;
      i.setAttribute("aria-label", BOUTIQUE.instagram + " sur Instagram");
    }
    majCompteur();
  });

  /* ---------- Carrousel : doigt, flèches, points, défilement doux ---------- */
  function carrousel(car) {
    const track = $(".track", car), slides = [...track.children], dots = [...car.querySelectorAll(".dots button")];
    let actif = 0, timer = null, stoppe = calme || slides.length < 2;
    const base = () => slides[0].offsetLeft;
    const aller = (i) => { actif = (i + slides.length) % slides.length; track.scrollTo({ left: slides[actif].offsetLeft - base(), behavior: calme ? "auto" : "smooth" }); };
    const arret = () => { stoppe = true; clearInterval(timer); };
    car.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => { arret(); aller(actif + Number(b.dataset.dir)); }));
    dots.forEach((d, i) => d.addEventListener("click", () => { arret(); aller(i); }));
    track.addEventListener("scroll", () => {
      const x = track.scrollLeft;
      let best = 0;
      slides.forEach((s, i) => { if (Math.abs(s.offsetLeft - base() - x) < Math.abs(slides[best].offsetLeft - base() - x)) best = i; });
      actif = best;
      dots.forEach((d, i) => d.setAttribute("aria-current", String(i === best)));
    }, { passive: true });
    ["pointerdown", "wheel", "keydown", "touchstart"].forEach((ev) => track.addEventListener(ev, arret, { passive: true }));
    new IntersectionObserver(([en]) => {
      clearInterval(timer);
      if (en.isIntersecting && !stoppe) timer = setInterval(() => aller(actif + 1), 4500);
    }, { threshold: 0.5 }).observe(track);
  }

  /* ---------- Vignette d'une création ---------- */
  function vignette(p) {
    const d = dispoResume(p);
    if (p.bientot) {
      return `<div class="card card-soon">
        <div class="card-img soon"><span class="mark mark-cream" aria-hidden="true"></span><span>Bientôt</span></div>
        <div class="card-line"><h3>${esc(p.nom)}</h3><span class="card-price">—</span></div>
        <p class="status ${d.cls}">En préparation</p>
      </div>`;
    }
    return `<a class="card" href="produit.html#${encodeURIComponent(p.id)}">
      <div class="card-img"><img src="${esc(p.photos[0].src)}" alt="${esc(p.photos[0].alt)}" loading="lazy" decoding="async"></div>
      <div class="card-line"><h3>${esc(p.nom)}</h3><span class="card-price${p.prix == null ? " ask" : ""}">${prixTxt(p.prix)}</span></div>
    </a>`;
  }

  return { $, esc, euro, prixTxt, parties, optPar, premiereOpt, calme, produit, enVente, toast, dispo, lire, ecrire, ajouter, libelle, carrousel, vignette, majCompteur };
})();
