/* =====================================================================
   COMPLICE — vos produits, prix et stocks
   C'est le seul fichier à modifier au quotidien.
   • stock : nombre de pièces prêtes. 0 = « Sur commande » (délai ci-dessous).
   • photos : dans le dossier img/, dans l'ordre où elles défilent.
     La première photo est celle de la vignette sur l'accueil.
   • Nouvelle création : copiez un bloc { id: ... } et donnez-lui un id
     unique, sans espace ni accent (il sert d'adresse : produit.html#id).
   • bientot: true → vignette « Bientôt » sur l'accueil, sans page.
   • prix: null → « Prix sur demande » (on peut commander, le prix est donné au contact).
   Gardez bien les virgules et les guillemets.
   ===================================================================== */

const BOUTIQUE = {
  nom: "Complice",
  instagram: "complice.be",
  email: "compliceshopinfo@gmail.com",
  ville: "Liège",
  delai: "2 semaines max",
  nuancier: "https://en.filcolana.dk/yarns/pernilla/farver.html",   // palette de couleurs de la laine      // délai pour une pièce sur commande

  /* Clé Web3Forms : les commandes arrivent par e-mail (voir LISEZMOI.md).
     Collez entre les guillemets la clé reçue par e-mail sur web3forms.com */
  cleFormulaire: "b542158a-2f75-4a7f-b014-0c8033904a30"
};

const PRODUITS = [
  {
    id: "col",
    nom: "Le col",
    prix: 20,
    accroche: "Un col ajouré qui se noue, à poser sur une chemise, un pull ou un blazer.",
    description: "Crocheté à la main, maille après maille, dans un point dentelle en éventail. Il se ferme par un petit cordon noué devant, se glisse sous le col d'une chemise ou par-dessus un revers de veste, et change une tenue simple en quelques secondes.",
    details: ["Fait main à Liège", "Taille unique, se noue", "Lavage à la main, à plat"],
    couleurs: [
      { nom: "Kaki", hex: "#5B5434", stock: 1 }
    ],
    photos: [
      { src: "img/col-1.jpg", alt: "Col kaki noué sur une chemise blanche" },
      { src: "img/col-2.jpg", alt: "Col kaki porté sur une chemise blanche, vu de face" },
      { src: "img/col-3.jpg", alt: "Col kaki porté sur une veste beige, dans une rue pavée" },
      { src: "img/col-4.jpg", alt: "Col kaki dépassant d'un blazer gris, de profil" },
      { src: "img/col-5.jpg", alt: "Col kaki sur chemise blanche, en buvant un café" },
      { src: "img/col-6.jpg", alt: "Col kaki posé sur les revers d'un blazer gris" },
      { src: "img/col-7.jpg", alt: "Col kaki sur blazer gris, mains et bagues au premier plan" },
      { src: "img/col-8.jpg", alt: "Détail du col kaki et de son nœud, cheveux sur l'épaule" },
      { src: "img/col-9.jpg", alt: "Détail du point dentelle du col kaki" },
      { src: "img/col-10.jpg", alt: "Col kaki sur blazer gris, assise à une table de café" }
    ]
  },
  {
    id: "manchettes",
    nom: "Les manchettes",
    prix: 15,
    accroche: "Des poignets en dentelle de laine qui dépassent des manches.",
    description: "Une paire de manchettes crochetées à la main, à enfiler au poignet sous une veste ou un pull. La bordure ajourée dépasse juste ce qu'il faut et réchauffe les mains sans gêner les doigts.",
    details: ["Vendues par paire", "Taille unique", "Lavage à la main, à plat"],
    couleurs: [
      { nom: "Natural White", hex: "#F4F1E8", stock: 1 },
      { nom: "Rouge", hex: "#C1121F", stock: 0 }
    ],
    photos: [
      { src: "img/manchettes-1.jpg", alt: "Manchettes blanches dépassant des manches d'un blazer gris" },
      { src: "img/manchettes-2.jpg", alt: "Manchettes blanches portées en buvant un café" },
      { src: "img/manchettes-rouge.jpg", alt: "Manchette rouge posée à plat sur une table en bois, à côté d'un café" }
    ]
  },
  {
    id: "ensemble",
    nom: "L'ensemble",
    prix: 30,
    composants: ["col", "manchettes"],   // le col + une paire de manchettes
    accroche: "Le col et les manchettes, assortis ou dépareillés.",
    description: "Le duo complet : un col à nouer et une paire de manchettes, dans les couleurs de votre choix. Ils se portent ensemble sur une chemise ou un blazer, ou chacun de leur côté.",
    details: ["Col + paire de manchettes", "Taille unique", "Lavage à la main, à plat"],
    photos: [
      { src: "img/col-4.jpg", alt: "Col kaki dépassant d'un blazer gris, de profil" },
      { src: "img/manchettes-1.jpg", alt: "Manchettes blanches dépassant des manches d'un blazer gris" },
      { src: "img/col-1.jpg", alt: "Col kaki noué sur une chemise blanche" },
      { src: "img/manchettes-2.jpg", alt: "Manchettes blanches portées en buvant un café" }
    ]
  },

  {
    id: "bonnet-brun",
    nom: "Le bonnet Grain",          // ⚠ nom provisoire, à valider
    prix: 30,
    accroche: "Un petit bonnet à la maille texturée, tout en grains de crochet.",
    description: "Crocheté à la main en petits points serrés qui dessinent une surface en relief. Plus ajusté et moins haut, il épouse bien la tête et se porte avec un léger revers.",
    details: ["Fait main à Liège", "Taille unique", "Lavage à la main, à plat"],
    couleurs: [ { nom: "Chocolat", hex: "#4B2E22", stock: 1 } ],
    photos: [
      { src: "img/bonnet-brun-1.jpg", alt: "Bonnet chocolat à revers, porté de profil devant des bambous" },
      { src: "img/bonnet-brun-2.jpg", alt: "Bonnet chocolat porté de profil, en buvant un matcha" },
      { src: "img/bonnet-brun-3.jpg", alt: "Bonnet chocolat porté avec des mitaines rayées" },
      { src: "img/bonnet-brun-4.jpg", alt: "Bonnet chocolat porté à une table de café" },
      { src: "img/bonnet-brun-5.jpg", alt: "Bonnet chocolat avec mitaines et petite écharpe rayée" },
      { src: "img/duo-bonnets-1.jpg", alt: "Les deux bonnets portés côte à côte" }
    ]
  },
  {
    id: "bonnet-anis",
    nom: "Le bonnet Marin",          // ⚠ nom provisoire, à valider
    prix: 30,
    accroche: "Un bonnet aux côtes bien droites, avec un gros rebord.",
    description: "Des côtes verticales crochetées à la main, nettes et régulières, et un large revers épais qui couvre bien les oreilles. Une ligne simple, façon bonnet de marin.",
    details: ["Fait main à Liège", "Taille unique", "Lavage à la main, à plat"],
    couleurs: [ { nom: "Anis", hex: "#A9B526", stock: 1 } ],
    photos: [
      { src: "img/bonnet-anis-1.jpg", alt: "Bonnet anis côtelé porté avec des lunettes vertes" },
      { src: "img/bonnet-anis-2.jpg", alt: "Bonnet anis porté en terrasse" },
      { src: "img/bonnet-anis-3.jpg", alt: "Bonnet anis porté de face, en terrasse" },
      { src: "img/bonnet-anis-4.jpg", alt: "Bonnet anis en selfie" },
      { src: "img/duo-bonnets-2.jpg", alt: "Les deux bonnets portés côte à côte" },
      { src: "img/duo-bonnets-3.jpg", alt: "Les deux bonnets, vert et brun" }
    ]
  },
  {
    id: "petite-echarpe",
    nom: "La petite écharpe",
    prix: 25,
    accroche: "Une écharpe fine à rayures, à nouer comme un foulard.",
    description: "Étroite et longue, crochetée à la main en rayures rouge et brun. Elle se noue près du cou, se croise sous un col de veste ou se laisse pendre comme une cravate.",
    details: ["Fait main à Liège", "Taille unique", "Lavage à la main, à plat"],
    couleurs: [ { nom: "Rouge & brun", hex: "#C1121F", stock: 1 } ],
    photos: [
      { src: "img/echarpe-1.jpg", alt: "Petite écharpe rayée nouée au cou, sous une veste en cuir" },
      { src: "img/echarpe-2.jpg", alt: "Petite écharpe rayée nouée, de profil" },
      { src: "img/echarpe-3.jpg", alt: "Petite écharpe portée ouverte sur une veste en cuir" },
      { src: "img/echarpe-4.jpg", alt: "Petite écharpe rayée enroulée autour du cou" },
      { src: "img/echarpe-5.jpg", alt: "Petite écharpe nouée comme une cravate" },
      { src: "img/echarpe-6.jpg", alt: "Petite écharpe rayée, regard vers le ciel" },
      { src: "img/echarpe-7.jpg", alt: "Petite écharpe et mitaine rayée" },
      { src: "img/echarpe-8.jpg", alt: "Petite écharpe nouée, vue de près" },
      { src: "img/echarpe-9.jpg", alt: "Petite écharpe enroulée, vue de près" },
      { src: "img/echarpe-10.jpg", alt: "Petite écharpe portée devant des bambous" },
      { src: "img/echarpe-11.jpg", alt: "Petite écharpe portée de profil devant des bambous" },
      { src: "img/echarpe-12.jpg", alt: "Petite écharpe croisée sous le col" },
      { src: "img/echarpe-13.jpg", alt: "Petite écharpe nouée, de profil" },
      { src: "img/echarpe-14.jpg", alt: "Petite écharpe avec mitaines, en buvant un matcha" },
      { src: "img/echarpe-15.jpg", alt: "Petite écharpe et mitaines, regard baissé" }
    ]
  },
  {
    id: "mitaines",
    nom: "Les mitaines",
    prix: 25,
    accroche: "Des mitaines longues qui laissent les doigts libres.",
    description: "Crochetées à la main, elles montent haut sur le poignet et se glissent sous une manche. Pratiques pour tenir un café, écrire ou prendre une photo sans avoir froid.",
    details: ["Vendues par paire", "Taille unique", "Lavage à la main, à plat"],
    couleurs: [
      { nom: "Rayées brun & taupe", hex: "#5A4640", stock: 1 },
      { nom: "Taupe", hex: "#9A8780", stock: 1 }
    ],
    photos: [
      { src: "img/mitaines-1.jpg", alt: "Mitaines rayées brun et taupe portées les mains jointes" },
      { src: "img/mitaines-2.jpg", alt: "Mitaines rayées tenant un col bordeaux" },
      { src: "img/mitaines-3.jpg", alt: "Mitaines rayées remontées sur le visage" },
      { src: "img/mitaines-4.jpg", alt: "Mitaines rayées en buvant un matcha" },
      { src: "img/mitaines-taupe-1.jpg", alt: "Mitaine taupe autour d'un verre de café" },
      { src: "img/mitaines-taupe-2.jpg", alt: "Mitaine taupe vue du dessus, avec un café" },
      { src: "img/mitaines-taupe-3.jpg", alt: "Une mitaine taupe et une mitaine rayée autour de deux boissons" }
    ]
  },
  {
    id: "col-roule",
    nom: "Le col roulé",
    prix: 30,
    accroche: "Un tour de cou montant, à porter roulé ou déplié sur les épaules.",
    description: "Crocheté à la main en côtes, il se remonte jusqu'au nez les jours de grand froid ou se replie en col sur une veste. Chaud sans être encombrant.",
    details: ["Fait main à Liège", "Taille unique", "Lavage à la main, à plat"],
    couleurs: [ { nom: "Bordeaux", hex: "#6B1A2B", stock: 1 } ],
    photos: [
      { src: "img/bordeaux-1.jpg", alt: "Col roulé bordeaux porté avec des mitaines rayées" },
      { src: "img/bordeaux-2.jpg", alt: "Col roulé bordeaux porté, regard de côté" },
      { src: "img/bordeaux-3.jpg", alt: "Col roulé bordeaux porté, regard baissé" },
      { src: "img/bordeaux-4.jpg", alt: "Col roulé bordeaux déplié sur les épaules" },
      { src: "img/bordeaux-5.jpg", alt: "Col roulé bordeaux porté de profil" },
      { src: "img/mitaines-2.jpg", alt: "Col roulé bordeaux remonté sur le visage, avec mitaines rayées" }
    ]
  },
  {
    id: "trio",
    nom: "Le trio",
    prix: 70,
    composants: [
      { cle: "bonnet", nom: "Le bonnet", choix: ["bonnet-anis", "bonnet-brun"] },
      "petite-echarpe",
      "mitaines"
    ],
    accroche: "Un bonnet, la petite écharpe et les mitaines, à composer vous-même.",
    description: "Le trio complet pour l'hiver : choisissez votre bonnet, puis la petite écharpe et une paire de mitaines. Trois pièces crochetées à la main qui se portent ensemble ou séparément.",
    details: ["Bonnet + petite écharpe + mitaines", "Taille unique", "Lavage à la main, à plat"],
    photos: [
      { src: "img/bonnet-brun-5.jpg", alt: "Bonnet, petite écharpe rayée et mitaine portés ensemble" },
      { src: "img/duo-bonnets-2.jpg", alt: "Les deux bonnets portés côte à côte" },
      { src: "img/echarpe-14.jpg", alt: "Petite écharpe et mitaines rayées" },
      { src: "img/bonnet-brun-3.jpg", alt: "Bonnet et mitaines rayées, en buvant un matcha" }
    ]
  }
];

/* Photos supplémentaires pour le bandeau qui défile sur l'accueil
   (pièces pas encore en boutique). Les plus récentes en premier. */
const DEFILE = [];
