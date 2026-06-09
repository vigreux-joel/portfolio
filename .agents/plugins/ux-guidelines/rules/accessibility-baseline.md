# Règle — Socle d'accessibilité

Contraintes a11y non négociables sur toute UI produite ou modifiée.

- **Contraste** : texte/contenu au minimum WCAG AA (4.5:1 texte normal, 3:1 grand texte / éléments d'interface).
- **Cibles tactiles** : zone interactive d'au moins 24×24 px (viser 44×44 px sur mobile).
- **HTML sémantique** : balises de sens (`button`, `nav`, `main`, `header`…), pas de `div` cliquable sans rôle.
- **Hiérarchie de titres** : un seul `h1`, pas de saut de niveau (`h2` → `h4`).
- **Formulaires** : chaque champ a un `label` associé.
- **Images** : `alt` pertinent (ou `alt=""` si purement décoratif).
- **Focus** : état de focus visible sur tout élément interactif.
- **Mouvement** : respecter `prefers-reduced-motion`.

Ces points sont vérifiables automatiquement par le skill `design-review`.
