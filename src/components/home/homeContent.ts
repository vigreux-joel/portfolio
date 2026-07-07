export const missionPath = "/mission";
export const profilePath = "/profil";

export const heroHighlights = [
  "orienté produit",
  "interfaces premium",
  "architecture maintenable",
  "livraison pragmatique",
  "IA utilisée avec rigueur",
] as const;

export const contextCards = [
  {
    eyebrow: "Confier une mission",
    title: "Un produit à cadrer, construire ou fiabiliser",
    description:
      "Pour avancer sur un besoin concret avec un regard produit, une exécution full-stack et une attention forte à la maintenabilité.",
    href: missionPath,
    cta: "Voir l’approche mission",
  },
  {
    eyebrow: "Évaluer mon profil",
    title: "Un développeur full-stack à intégrer à votre équipe",
    description:
      "Pour juger mon parcours, ma posture, mon niveau technique et ma capacité à contribuer dans une équipe produit exigeante.",
    href: profilePath,
    cta: "Voir mon profil candidat",
  },
] as const;

export const projectProofs = [
  "Problème initial",
  "Contraintes et arbitrages",
  "Décisions techniques",
  "Résultat produit",
] as const;

export const expertiseProofs = [
  "Interfaces web lisibles et soignées",
  "Architecture back-end maintenable",
  "APIs typées et intégrables",
  "Performance et accessibilité utiles au produit",
] as const;

export const methodProofs = [
  "Cadrage avant exécution",
  "Architecture pensée pour durer",
  "Revue, tests et sécurisation",
] as const;
