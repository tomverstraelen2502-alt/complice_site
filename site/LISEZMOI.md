# Complice — le site

Un site léger, écrit à la main (HTML, CSS, JavaScript), sans traceur ni outil externe à part la police Archivo.

| Fichier | Rôle |
|---|---|
| `produits.js` | **À modifier** : prix, stocks, couleurs, textes et photos de chaque pièce, contact, délai |
| `index.html` | Les textes de l'accueil, de « Notre idée » et du formulaire |
| `style.css` | Couleurs (en haut du fichier) et mise en page |
| `produit.html` + `produit.js` | La page d'une création (une seule page pour toutes : `produit.html#col`) |
| `commun.js`, `accueil.js` | Le fonctionnement (vignettes, carrousels, commande) — rarement à toucher |
| `merci.html` | Page affichée après une commande |
| `img/` | Photos, logo et icônes |

## Mettre à jour
- **Stock** : dans `produits.js`, changez `stock: 1`. `0` = « Sur commande » (délai dans `BOUTIQUE.delai`).
- **Prix** : `prix: 20`.
- **Nouvelle couleur** : ajoutez une ligne dans `couleurs`, ex. `{ nom: "Bordeaux", hex: "#6B1A22", stock: 0 }`.
- **Nouvelle photo** : mettez-la dans `img/` (environ 1200 px de large suffit), puis ajoutez une ligne dans `photos`.
- Puis mettez le site à jour sur Vercel (voir ci-dessous).

## Ajouter une nouvelle création (bonnets, mitaines…)
Dans `produits.js`, les créations à venir sont marquées `bientot: true` : elles s'affichent en vignette « Bientôt ».
Quand les photos sont prêtes, complétez le bloc sur le modèle du col (prix, textes, couleurs, photos)
et retirez `bientot: true`. La vignette et la page de la création apparaissent toutes seules.

## Couleurs
Le lien du nuancier (laine Pernilla de Filcolana) se change dans `produits.js`, ligne `nuancier:`.
Les pastilles de la section « Couleurs » reprennent automatiquement les couleurs de vos créations.

## Recevoir les commandes par e-mail (Web3Forms, gratuit)
1. Allez sur https://web3forms.com, entrez compliceshopinfo@gmail.com et cliquez sur « Create Access Key ».
2. Vous recevez une clé par e-mail (une suite de lettres et de chiffres).
3. Dans `produits.js`, collez-la à la ligne `cleFormulaire: ""`, entre les guillemets.
4. Mettez le site à jour. Chaque commande arrive alors dans votre boîte mail ; « Répondre » écrit directement au client.
Gratuit jusqu'à 250 commandes par mois. La clé peut être visible dans le code, c'est prévu ainsi.

## Mettre en ligne avec Vercel
### Sans GitHub (le plus simple)
Allez sur https://vercel.com/drop, glissez le dossier `site` (ou le .zip), donnez un nom au projet, puis « Deploy ».

### Avec GitHub (recommandé pour les mises à jour régulières)
Une fois relié, chaque modification enregistrée sur GitHub met le site à jour toute seule, au même lien.
1. Créez un compte sur https://github.com, puis « New repository » nommé `complice-site` (public ou privé).
2. Sur la page du dépôt vide : « uploading an existing file » → glissez **le contenu** du dossier `site`
   (index.html, img/, etc., pas le dossier lui-même) → « Commit changes ».
3. Sur https://vercel.com : « Add New… → Project » → « Import » votre dépôt `complice-site` → « Deploy ».
   Laissez les réglages par défaut (pas de framework, pas de commande de build).
4. Pour modifier ensuite : ouvrez le fichier sur GitHub (par ex. `produits.js`), cliquez sur le crayon ✎,
   changez un prix ou un stock, puis « Commit changes ». Vercel republie en une minute.
   Pour une nouvelle photo : dossier `img` → « Add file → Upload files ».

## Le logo
`img/logo-mark.png` (le « Co ») et `img/logo-wordmark.png` (« Complice ») sont colorés par le site :
la même image s'affiche en crème sur le vert et en vert sur le clair.
