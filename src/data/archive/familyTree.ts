import type { ArchiveFamilyTree } from "@/models";

export const familyTree: ArchiveFamilyTree = {
  disclaimer: "Certains liens viennent des clips d’origine. D’autres, des fans.",
  nodes: [
    { id: "tralalero-tralala", name: "Tralalero Tralala", slug: "tralalero-tralala" },
    { id: "bombardiro-crocodilo", name: "Bombardiro Crocodilo", slug: "bombardiro-crocodilo" },
    { id: "bombombini-gusini", name: "Bombombini Gusini", slug: "bombombini-gusini" },
    { id: "ballerina-cappuccina", name: "Ballerina Cappuccina", slug: "ballerina-cappuccina" },
    { id: "cappuccino-assassino", name: "Cappuccino Assassino", slug: "cappuccino-assassino" },
    { id: "tung-tung-tung-sahur", name: "Tung Tung Tung Sahur", slug: "tung-tung-tung-sahur" },
    { id: "espressona-signora", name: "Espressona Signora" },
  ],
  edges: [
    {
      from: "tralalero-tralala",
      to: "bombardiro-crocodilo",
      label: "Rivalité",
    },
    {
      from: "bombardiro-crocodilo",
      to: "bombombini-gusini",
      label: "Fratrie",
    },
    {
      from: "ballerina-cappuccina",
      to: "cappuccino-assassino",
      label: "Couple",
    },
    {
      from: "ballerina-cappuccina",
      to: "tung-tung-tung-sahur",
      label: "Liaison",
    },
    {
      from: "ballerina-cappuccina",
      to: "espressona-signora",
      label: "Sœurs",
    },
  ],
  clusters: [
    {
      kind: "chain",
      title: "Tralalero & Bombardiro",
      nodes: ["tralalero-tralala", "bombardiro-crocodilo", "bombombini-gusini"],
    },
    {
      kind: "fork",
      title: "Ballerina Cappuccina",
      hub: "ballerina-cappuccina",
      children: [
        "cappuccino-assassino",
        "tung-tung-tung-sahur",
        "espressona-signora",
      ],
    },
  ],
};
