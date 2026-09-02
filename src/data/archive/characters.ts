import type { ArchiveCharacter, ArchiveRelatedLink } from "@/models";

const noTee = (name: string) =>
  `On ne vend pas ${name}. Compose une créature originale.`;

export const archiveCharacters: ArchiveCharacter[] = [
  {
    slug: "tralalero-tralala",
    name: "Tralalero Tralala",
    seoTitle: "C’est qui Tralalero Tralala ?",
    seoDescription:
      "Tralalero Tralala : requin aux baskets, mème Italian Brainrot. Apparu sur TikTok début 2025.",
    tagline: "Un requin debout, souvent avec des baskets bleues.",
    summary:
      "Un requin debout, avec des jambes et des baskets. C’est l’un des memes Italian Brainrot les plus connus, apparu sur TikTok début 2025.",
    appearance: [
      "Requin à trois « jambes », baskets Nike. C’est la version qui a collé.",
    ],
    whyBrainrot: [
      "Souvent vu comme le premier gros perso de la vague. Son nom et son image absurde ont servi de modèle aux autres.",
    ],
    documented: [
      "Audio souvent attribué à @eZburger401 (janvier 2025). Le compte a été banni.",
      "Le 13 janvier 2025, @amoamimandy.1a poste l’image du requin en baskets (vidéo ensuite supprimée, ~7 millions de vues).",
      "Le son « Tralalero tralala » existait déjà en 2023, dans des mèmes audio autour de Dwayne Johnson.",
    ],
    uncertain: [
      "Si @eZburger401 a aussi créé l’image, ou seulement l’audio.",
    ],
    communityLore: [
      "Les fans le font souvent combattre Bombardiro Crocodilo.",
    ],
    relatedLinks: [
      {
        slug: "bombardiro-crocodilo",
        reason: "Rival dans les vidéos de combats fans.",
      },
      {
        slug: "ballerina-cappuccina",
        reason: "Autre icône de la même vague.",
      },
      {
        slug: "brr-brr-patapim",
        reason: "Souvent listé à côté dans les compilations.",
      },
    ],
    brainrototoDisclaimer: noTee("Tralalero Tralala"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Requin à trois jambes, baskets Nike",
      platform: "TikTok",
      period: "Janvier 2025",
      geographicOrigin: "Italian Brainrot",
      brainrotFamily: "Italian Brainrot",
      officialCanon: "Aucune",
    },
    wave: "italian",
    tags: ["animal"],
    relatedOriginalIds: ["melonsharko", "requinfraise", "requinbanane"],
    stickerTone: "cyan",
    image: "/assets/archive/tralalero-tralala.webp",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@fishy.ai/video/7495436456094076182",
      videoId: "7495436456094076182",
      creator: "fishy.ai",
    },
  },
  {
    slug: "bombardiro-crocodilo",
    name: "Bombardiro Crocodilo",
    seoTitle: "Bombardiro Crocodilo : origine et explication",
    seoDescription:
      "Bombardiro Crocodilo : crocodile-bombardier, mème Italian Brainrot. TikTok 2025.",
    tagline: "Un crocodile avec le corps d’un avion bombardier.",
    summary:
      "Un avion bombardier avec une tête de crocodile. Autre gros perso de la vague TikTok 2025. On écrit aussi « Bombardino Crocodilo ».",
    appearance: [
      "Bombardier bimoteur, tête de crocodile à la place du nez. Animal + avion, en une seconde.",
    ],
    whyBrainrot: [
      "Avec Tralalero, c’est le perso le plus cité pour expliquer le phénomène. Nom facile, image plus « méchante » que les mascottes mignonnes.",
    ],
    documented: [
      "Première vidéo connue : 20 février 2025, @armenjiharhanyan.",
      "Même créateur que Bombombini Gusini.",
      "L’audio de certaines vidéos a été critiqué. Cette fiche ne reprend pas les paroles.",
    ],
    uncertain: [
      "S’il existait une vidéo plus ancienne, depuis disparue.",
    ],
    communityLore: [
      "Souvent rival de Tralalero dans les combats fans.",
      "Autre histoire très répétée : son frère Gusini le trahit, passe côté oiseaux, puis Bombardiro le tue une fois le boost de Lirili disparu.",
    ],
    relatedLinks: [
      {
        slug: "tralalero-tralala",
        reason: "Rival dans les combats fans.",
      },
      {
        slug: "bombombini-gusini",
        reason: "Frère dès le clip d’origine de Gusini. Même créateur.",
      },
      {
        slug: "brr-brr-patapim",
        reason: "Autre perso de la même liste.",
      },
    ],
    brainrototoDisclaimer: noTee("Bombardiro Crocodilo"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Tête de crocodile sur un bombardier",
      platform: "TikTok",
      period: "Février 2025",
      geographicOrigin: "Italian Brainrot",
      brainrotFamily: "Italian Brainrot",
      officialCanon: "Aucune",
    },
    wave: "italian",
    tags: ["animal", "machine"],
    relatedOriginalIds: ["banacrocodilo", "crocopizza"],
    stickerTone: "green",
    image: "/assets/archive/bombardiro-crocodilo.jpg",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@ibrotherbrain/video/7494360676392095006",
      videoId: "7494360676392095006",
      creator: "ibrotherbrain",
    },
  },
  {
    slug: "ballerina-cappuccina",
    name: "Ballerina Cappuccina",
    seoTitle: "C’est qui Ballerina Cappuccina ?",
    seoDescription:
      "Ballerina Cappuccina : ballerine à tête de cappuccino. Mème Italian Brainrot, TikTok 2025.",
    tagline: "Une ballerine en tutu, tête en tasse de cappuccino.",
    summary:
      "Une danseuse classique dont la tête est une tasse de cappuccino. Perso star de la vague 2025, côté café et cliché italien.",
    appearance: [
      "Tutu, pointes, posture de danse. À la place de la tête : une tasse de cappuccino.",
    ],
    whyBrainrot: [
      "Même recette que le requin ou le crocodile-avion, mais plus mignon. Beaucoup de gens sont arrivés au brainrot par elle.",
    ],
    documented: [
      "Clip d’origine : 19 mars 2025, @aironic.fun (Susanu Sava-Tudor, Roumanie — New York Times).",
      "La vidéo la présente déjà comme la femme de Cappuccino Assassino.",
    ],
    uncertain: [
      "Les détails du clip d’origine selon les copies encore en ligne.",
    ],
    communityLore: [
      "Les fans ajoutent un triangle avec Tung Tung, une sœur Espressona Signora, etc.",
    ],
    relatedLinks: [
      {
        slug: "cappuccino-assassino",
        reason: "Déjà présentée comme sa femme dans le clip d’origine.",
      },
      {
        slug: "tung-tung-tung-sahur",
        reason: "Parfois dans les mêmes intrigues fans.",
      },
      {
        slug: "tralalero-tralala",
        reason: "Autre icône de la vague.",
      },
    ],
    brainrototoDisclaimer: noTee("Ballerina Cappuccina"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Ballerine, tête en tasse de cappuccino",
      platform: "TikTok",
      period: "19 mars 2025",
      geographicOrigin: "Italian Brainrot",
      brainrotFamily: "Italian Brainrot",
      officialCanon: "Aucune",
    },
    wave: "italian",
    tags: ["food"],
    relatedOriginalIds: ["banacrocodilo", "pommecroc"],
    stickerTone: "pink",
    image: "/assets/archive/ballerina-cappuccina.png",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@aironic.fun/video/7483426614135491862",
      videoId: "7483426614135491862",
      creator: "aironic.fun",
    },
  },
  {
    slug: "cappuccino-assassino",
    name: "Cappuccino Assassino",
    seoTitle: "Cappuccino Assassino expliqué",
    seoDescription:
      "Cappuccino Assassino : ninja-café de l’Italian Brainrot. Souvent lié à Ballerina Cappuccina.",
    tagline: "Un gobelet de cappuccino habillé en ninja.",
    summary:
      "Une tasse de cappuccino en ninja, avec des lames. Il apparaît avant Ballerina Cappuccina, qui s’y greffe ensuite.",
    appearance: [
      "Gobelet de café à emporter, visage sur la tasse, bandeau et katanas.",
    ],
    whyBrainrot: [
      "Même famille « café » que Ballerina, ton plus action. Beaucoup de gens le découvrent via le duo.",
    ],
    documented: [
      "Première vidéo connue : 5 mars 2025, @alexey_pigeon — deux semaines avant Ballerina.",
      "Même créateur que Chimpanzini Bananini.",
    ],
    uncertain: [
      "Si Assassino parlait déjà de Ballerina dans son clip, ou seulement l’inverse.",
    ],
    communityLore: [
      "Les fans ont ensuite inventé trahisons et triangles avec Tung Tung.",
    ],
    relatedLinks: [
      {
        slug: "ballerina-cappuccina",
        reason: "Elle le présente comme son mari dans son clip d’origine.",
      },
      {
        slug: "tung-tung-tung-sahur",
        reason: "Parfois dans le même triangle.",
      },
      {
        slug: "chimpanzini-bananini",
        reason: "Même créateur : @alexey_pigeon.",
      },
    ],
    brainrototoDisclaimer: noTee("Cappuccino Assassino"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Gobelet de cappuccino en ninja",
      platform: "TikTok",
      period: "5 mars 2025",
      geographicOrigin: "Italian Brainrot",
      brainrotFamily: "Italian Brainrot",
      officialCanon: "Aucune",
    },
    wave: "italian",
    tags: ["food"],
    relatedOriginalIds: ["banacrocodilo", "pommecroc"],
    stickerTone: "violet",
    image: "/assets/archive/cappuccino-assassino.webp",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@fishy.ai/video/7496821844268289302",
      videoId: "7496821844268289302",
      creator: "fishy.ai",
    },
  },
  {
    slug: "tung-tung-tung-sahur",
    name: "Tung Tung Tung Sahur",
    seoTitle: "Tung Tung Tung Sahur : le personnage expliqué",
    seoDescription:
      "Tung Tung Tung Sahur : tambour de bois et gourdin. Mème indonésien (sahur), souvent listé avec les brainrots.",
    tagline: "Un tambour de bois, souvent avec un gourdin.",
    summary:
      "Un kentongan (tambour de bois indonésien) avec un visage et un gourdin. Créé en Indonésie le 28 février 2025, la veille du Ramadan. On le range souvent dans l’Italian Brainrot, mais il n’est pas italien.",
    appearance: [
      "Tambour de bois (kentongan), visage simple, gourdin (pentungan) à la main. Le « tung tung tung » imite le bruit du tambour qui réveille pour le sahur.",
    ],
    whyBrainrot: [
      "Les compilations 2025 ont tout mis dans le même sac. Beaucoup le découvrent dans une liste brainrot, pas via son contexte indonésien.",
    ],
    documented: [
      "28 février 2025, @noxaasht (Noxa), Indonésie. Image faite avec DALL·E.",
      "Le clip d’origine : une « anomalie » qui vient chez toi si tu n’es pas réveillé pour le sahur.",
      "Fait partie du trend indonésien « Anomali AI », pas de l’Italian Brainrot à la base.",
    ],
    uncertain: [
      "Les copies du clip d’origine : le texte exact varie un peu.",
    ],
    communityLore: [
      "Les fans l’ont collé aux persos italiens : triangle avec Ballerina et Assassino, combats contre Tralalero.",
    ],
    relatedLinks: [
      {
        slug: "ballerina-cappuccina",
        reason: "Parfois dans les intrigues fans.",
      },
      {
        slug: "boneca-ambalabu",
        reason: "Même vague internationale.",
      },
      {
        slug: "cappuccino-assassino",
        reason: "Parfois dans le même triangle.",
      },
    ],
    brainrototoDisclaimer: noTee("Tung Tung Tung Sahur"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Tambour de bois, gourdin",
      platform: "TikTok",
      period: "28 février 2025",
      geographicOrigin: "Indonésie",
      brainrotFamily: "Vague internationale",
      officialCanon: "Aucune",
    },
    wave: "indonesian",
    tags: [],
    relatedOriginalIds: ["duckpizza", "chatpizza"],
    stickerTone: "orange",
    image: "/assets/archive/tung-tung-tung-sahur.png",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@fishy.ai/video/7485383108724886806",
      videoId: "7485383108724886806",
      creator: "fishy.ai",
    },
  },
  {
    slug: "brr-brr-patapim",
    name: "Brr Brr Patapim",
    seoTitle: "C’est qui Brr Brr Patapim ?",
    seoDescription:
      "Brr Brr Patapim : hybride animal-arbre, mème Italian Brainrot. TikTok 2025.",
    tagline: "Un singe-arbre aux grands pieds.",
    summary:
      "Un hybride singe + arbre, avec d’énormes pieds. Le nom se scande tout seul.",
    appearance: [
      "Singe-arbre, grands pieds, parfois une barbe. Les visuels varient un peu, la silhouette reste.",
    ],
    whyBrainrot: [
      "Un classique des quiz « nomme tous les brainrots ». Le nom compte autant que l’image.",
    ],
    documented: [
      "17 février 2025, @ofuscabreno — aussi créateur de Boneca Ambalabu.",
      "Phrase d’origine : « Brr brr patapim, il mio cappello è pieno di Slim ! »",
    ],
    uncertain: [
      "Les copies du visuel d’origine : ça change d’une vidéo à l’autre.",
    ],
    communityLore: [
      "Les fans le placent dans des forêts et des combats, sans version unique.",
    ],
    relatedLinks: [
      {
        slug: "tralalero-tralala",
        reason: "Souvent dans les mêmes compilations.",
      },
      {
        slug: "lirili-larila",
        reason: "Autre hybride animal-plante.",
      },
      {
        slug: "boneca-ambalabu",
        reason: "Même créateur : @ofuscabreno.",
      },
    ],
    brainrototoDisclaimer: noTee("Brr Brr Patapim"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Singe-arbre, grands pieds",
      platform: "TikTok",
      period: "17 février 2025",
      geographicOrigin: "Italian Brainrot",
      brainrotFamily: "Italian Brainrot",
      officialCanon: "Aucune",
    },
    wave: "italian",
    tags: ["animal"],
    relatedOriginalIds: ["fragolafrogo", "frogpasteque"],
    stickerTone: "green",
    image: "/assets/archive/brr-brr-patapim.jpg",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@ibrotherbrain/video/7486592353453542687",
      videoId: "7486592353453542687",
      creator: "ibrotherbrain",
    },
  },
  {
    slug: "lirili-larila",
    name: "Lirili Larila",
    seoTitle: "C’est qui Lirili Larila ?",
    seoDescription:
      "Lirili Larila : éléphant-cactus en sandales. Mème Italian Brainrot, TikTok 2025.",
    tagline: "Un éléphant-cactus, souvent en sandales.",
    summary:
      "Un éléphant avec un corps de cactus, qui marche en sandales. Nom chanté, perso classique de 2025.",
    appearance: [
      "Tête d’éléphant, corps cactus, sandales. Souvent dans un désert.",
    ],
    whyBrainrot: [
      "Exemple simple de nom + image absurde. Présent dans les quiz et les compilations.",
    ],
    documented: [
      "Février 2025, @capybarawt. La vidéo d’origine a été supprimée.",
      "Motif : éléphant + cactus + sandales, dans un désert. Parfois un réveil qui flotte à côté.",
    ],
    uncertain: [
      "La date exacte du premier post (les sources disent entre le 10 et le 28 février).",
    ],
    communityLore: [
      "Les fans lui collent un pouvoir sur le temps, via le réveil qui flotte. Pas dans le clip d’origine.",
      "Dans la guerre croco vs oiseaux, elle boosterait Gusini. Tung Tung la frappe, le boost saute, Gusini se fait tuer par Bombardiro.",
    ],
    relatedLinks: [
      {
        slug: "tralalero-tralala",
        reason: "Même vague.",
      },
      {
        slug: "brr-brr-patapim",
        reason: "Autre hybride absurde.",
      },
      {
        slug: "chimpanzini-bananini",
        reason: "Souvent dans les mêmes listes.",
      },
    ],
    brainrototoDisclaimer: noTee("Lirili Larila"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Éléphant + cactus + sandales",
      platform: "TikTok",
      period: "Février 2025",
      geographicOrigin: "Italian Brainrot",
      brainrotFamily: "Italian Brainrot",
      officialCanon: "Aucune",
    },
    wave: "italian",
    tags: ["animal"],
    relatedOriginalIds: [],
    stickerTone: "yellow",
    image: "/assets/archive/lirili-larila.webp",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@fishy.ai/video/7479933279257300246",
      videoId: "7479933279257300246",
      creator: "fishy.ai",
    },
  },
  {
    slug: "chimpanzini-bananini",
    name: "Chimpanzini Bananini",
    seoTitle: "C’est qui Chimpanzini Bananini ?",
    seoDescription:
      "Chimpanzini Bananini : singe-banane, mème Italian Brainrot. TikTok 2025.",
    tagline: "Un chimpanzé dont le corps est une banane.",
    summary:
      "Un chimpanzé fusionné avec une banane. Le nom le plus clair de la formule animal + Food + suffixe italien.",
    appearance: [
      "Tête de chimpanzé, corps-banane. On comprend le combo avant d’entendre le nom.",
    ],
    whyBrainrot: [
      "L’exemple qu’on prend pour expliquer les noms. Présent dans presque toutes les listes 2025.",
    ],
    documented: [
      "13 mars 2025, @alexey_pigeon — même créateur que Cappuccino Assassino.",
      "La vidéo d’origine montrait plusieurs singes-fruits (banane, coco, ananas…). C’est la banane qui a collé.",
    ],
    uncertain: [
      "Pourquoi les autres hybrides de la même vidéo n’ont pas pris.",
    ],
    communityLore: [
      "Les fans lui collent des combats et un rôle de leader. Ça change selon les montages.",
    ],
    relatedLinks: [
      {
        slug: "tralalero-tralala",
        reason: "Même phénomène.",
      },
      {
        slug: "cappuccino-assassino",
        reason: "Même créateur : @alexey_pigeon.",
      },
      {
        slug: "brr-brr-patapim",
        reason: "Souvent dans les mêmes compilations.",
      },
    ],
    brainrototoDisclaimer: noTee("Chimpanzini Bananini"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Tête de chimpanzé, corps en banane",
      platform: "TikTok",
      period: "13 mars 2025",
      geographicOrigin: "Italian Brainrot",
      brainrotFamily: "Italian Brainrot",
      officialCanon: "Aucune",
    },
    wave: "italian",
    tags: ["animal", "food"],
    relatedOriginalIds: ["ananasinge", "singefraise"],
    stickerTone: "yellow",
    image: "/assets/archive/chimpanzini-bananini.webp",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@fishy.ai/video/7498038415754104086",
      videoId: "7498038415754104086",
      creator: "fishy.ai",
    },
  },
  {
    slug: "bombombini-gusini",
    name: "Bombombini Gusini",
    seoTitle: "C’est qui Bombombini Gusini ?",
    seoDescription:
      "Bombombini Gusini : oie-avion de chasse. Mème Italian Brainrot, souvent lié à Bombardiro.",
    tagline: "Une oie avec le corps d’un avion de chasse.",
    summary:
      "Une oie fusionnée avec un avion de chasse. Même créateur que Bombardiro, présenté comme son frère dès le premier clip.",
    appearance: [
      "Avion de chasse, tête d’oie à l’avant. Même idée que Bombardiro, avec un oiseau à la place du crocodile.",
    ],
    whyBrainrot: [
      "Il complète le thème animal + avion. Le lien de fratrie vient du clip d’origine, pas seulement des fans.",
    ],
    documented: [
      "5 mars 2025, @armenjiharhanyan — le même que Bombardiro (20 février).",
      "Le clip d’origine le présente déjà comme le frère de Bombardiro.",
    ],
    uncertain: [
      "S’il existait une version plus ancienne, depuis disparue.",
    ],
    communityLore: [
      "Les fans ont inventé une guerre crocodiles contre oiseaux. Gusini se lasse de son frère, change de camp, et Lirili Larila lui file un coup de boost.",
      "Dans la version la plus répétée, Tung Tung met Lirili KO : le boost saute, Gusini redevient faible, et Bombardiro le tue.",
    ],
    relatedLinks: [
      {
        slug: "bombardiro-crocodilo",
        reason: "Frère dès le clip d’origine. Même créateur.",
      },
      {
        slug: "tralalero-tralala",
        reason: "Autre icône de la vague.",
      },
      {
        slug: "lirili-larila",
        reason: "Dans le lore fans, c’est elle qui le booste pendant la guerre contre son frère.",
      },
    ],
    brainrototoDisclaimer: noTee("Bombombini Gusini"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Oie + avion de chasse",
      platform: "TikTok",
      period: "5 mars 2025",
      geographicOrigin: "Italian Brainrot",
      brainrotFamily: "Italian Brainrot",
      officialCanon: "Aucune",
    },
    wave: "italian",
    tags: ["animal", "machine"],
    relatedOriginalIds: ["duckpizza", "canardananas"],
    stickerTone: "blue",
    image: "/assets/archive/bombombini-gusini.webp",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@fishy.ai/video/7484308716406213910",
      videoId: "7484308716406213910",
      creator: "fishy.ai",
    },
  },
  {
    slug: "boneca-ambalabu",
    name: "Boneca Ambalabu",
    seoTitle: "C’est qui Boneca Ambalabu ?",
    seoDescription:
      "Boneca Ambalabu : grenouille-pneu, mème de la vague internationale Brainrot.",
    tagline: "Une grenouille-pneu, avec des jambes humaines.",
    summary:
      "Un hybride grenouille + pneu, jambes humaines. Créé en Indonésie. Souvent classé Italian Brainrot, mais le nom vient de boneka (« poupée » en indonésien).",
    appearance: [
      "Grenouille verte fusionnée avec un pneu, jambes humaines, debout.",
    ],
    whyBrainrot: [
      "Les compilations 2025 l’ont mis à côté des persos italiens. Le nom se retient, même si l’image change.",
    ],
    documented: [
      "2 février 2025, @ofuscabreno (Indonésie) — aussi créateur de Brr Brr Patapim.",
      "L’audio est repris d’une vidéo de 2024, pas inventé pour ce clip.",
    ],
    uncertain: [
      "Le sens exact d’Ambalabu (mélange de mèmes, selon les sources).",
    ],
    communityLore: [
      "Une fois dans les listes, les fans l’ont collé aux mêmes combats que Tralalero ou Bombardiro.",
    ],
    relatedLinks: [
      {
        slug: "brr-brr-patapim",
        reason: "Même créateur : @ofuscabreno.",
      },
      {
        slug: "tung-tung-tung-sahur",
        reason: "Même vague internationale.",
      },
      {
        slug: "tralalero-tralala",
        reason: "Souvent dans les mêmes quiz.",
      },
    ],
    brainrototoDisclaimer: noTee("Boneca Ambalabu"),
    factSheet: {
      type: "Mème TikTok (image IA)",
      appearance: "Grenouille + pneu + jambes",
      platform: "TikTok",
      period: "2 février 2025",
      geographicOrigin: "Indonésie",
      brainrotFamily: "Vague internationale",
      officialCanon: "Aucune",
    },
    wave: "international",
    tags: ["animal"],
    relatedOriginalIds: ["fragolafrogo", "frogbanane"],
    stickerTone: "pink",
    image: "/assets/archive/boneca-ambalabu.jpg",
    video: {
      platform: "tiktok",
      url: "https://www.tiktok.com/@ofuscabreno/video/7466833000966196486",
      videoId: "7466833000966196486",
      creator: "ofuscabreno",
    },
  },
];

export const homeArchiveSlugs = [
  "tralalero-tralala",
  "bombardiro-crocodilo",
  "ballerina-cappuccina",
  "tung-tung-tung-sahur",
  "brr-brr-patapim",
  "chimpanzini-bananini",
] as const;

export function getHomeArchiveCharacters() {
  return getRelatedArchiveCharacters([...homeArchiveSlugs]);
}

export function getArchiveCharacter(slug: string) {
  return archiveCharacters.find((character) => character.slug === slug);
}

export function getRelatedArchiveCharacters(slugs: string[]) {
  return slugs
    .map((slug) => getArchiveCharacter(slug))
    .filter((character): character is ArchiveCharacter => Boolean(character));
}

export function getRelatedArchiveCharacterLinks(links: ArchiveRelatedLink[]) {
  return links
    .map((link) => {
      const character = getArchiveCharacter(link.slug);
      return character ? { character, reason: link.reason } : null;
    })
    .filter((entry): entry is { character: ArchiveCharacter; reason: string } =>
      Boolean(entry),
    );
}
