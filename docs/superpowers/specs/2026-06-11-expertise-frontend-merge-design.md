# Expertise — Fusion Design&Ux dans React & Motion + harmonisation du bloc Front-End

Date : 2026-06-11
Page concernée : `/expertise`
Périmètre : tout le contenu **au-dessus** de la section `back-end`.

## Objectif

Supprimer la section autonome « Design & Ux » et faire de **React & Motion** la pièce
centrale qui porte aussi le discours design / Material 3, en s'appuyant sur la
**librairie UI udixio** comme preuve concrète. Harmoniser la présentation des
technologies (Astro/Angular = web, Flutter = multiplateforme) et préserver le
circuit visuel continu des `Line`.

## État actuel

- `src/pages/expertise.astro` enchaîne : `HeroSection` → `FrontEndSection` →
  `UxSection` → `BackEndSection` → `PhilosophieSection` → `FaqSection`.
- `FrontEndSection.astro` contient : intro Front-End → duel Astro/Angular →
  carte **React & Motion** (texte seul) → bloc **Développement multiplateforme**
  (Flutter) avec 8 mini-cards plateformes colorées. Thème `purple`, finit
  `LinearGradient nextTheme="blue"`.
- `UxSection.astro` : titre « Design & Ux » + `StickyScroll` (3 panneaux :
  vidéo Material 3 `output.mp4`, image harmonisation couleurs, animation Framer
  Motion). Thème `purple`, finit `LinearGradient nextTheme="green"`.
- `BackEndSection.astro` : thème `green`.
- Le composant `Line` dessine un circuit d'énergie vertical continu ; `nextTheme`
  pilote le dégradé de couleur d'une section à la suivante.

## Décisions (validées)

1. **Lien preuve** → route interne `/projets/udixio-ui` (page d'étude de cas à
   créer plus tard ; cohérent avec le lien `/projets` du menu). Pas de lien direct
   vers `ui.udixio.fr`.
2. **Contenu fusionné** : la **vidéo `output.mp4`** devient le visuel unique de
   React & Motion. Le discours Material 3 / harmonisation / Framer Motion est
   condensé en texte (pas de StickyScroll conservé dans la section).
3. **Plateformes Flutter** : les 8 mini-cards colorées sont remplacées par un
   **bandeau d'icônes monochrome épuré** (Web · iOS · Android · Windows · macOS · Linux).
4. **Disposition carte React & Motion** : moderne / asymétrique — vidéo pleine
   hauteur débordant sur le bord droit (bleed), texte flottant à gauche, **petit
   panneau « preuve lib UI + CTA »** qui chevauche la frontière texte/vidéo.
5. **StickyScroll** : `sticky-scroll-reveal.tsx` est conservé dans le repo mais
   n'est plus importé.

## Changements détaillés

### `src/pages/expertise.astro`
- Retirer l'import et l'usage de `UxSection`.

### `src/components/expertise/FrontEndSection.astro`

**a) Duel Astro / Angular** — ajouter un eyebrow `Technologies web` au-dessus du
duel pour cadrer explicitement Astro & Angular comme technologies web. Contenu des
deux `Techno` inchangé.

**b) Carte React & Motion** — réécriture de la carte (lignes ~98-145) :
- `Card variant="elevated"`, `overflow-hidden relative`.
- **Vidéo** `(/video/output.mp4)` : `autoplay loop muted playsInline`, `object-cover`,
  positionnée à droite, pleine hauteur de la carte, débordant légèrement le padding
  droit (effet bleed). Enveloppée dans un `<a href="/projets/udixio-ui">` (toute la
  vidéo cliquable) avec `aria-label` explicite.
- **Texte** (premier plan, colonne gauche, ~45 %) : identité `Techno` React & Motion,
  titre « L'animation n'est pas cosmétique. / Elle dirige le regard. », un paragraphe
  condensé reprenant Material Design 3 (conception fluide, design system) + Framer
  Motion.
- **Panneau preuve flottant** : petite surface (`bg-surface-container` / élevée,
  coins arrondis) chevauchant la frontière texte/vidéo, contenant la mention
  « ma librairie UI — adaptation de Material 3 en Tailwind, développée sur mon temps
  personnel depuis 2024 » + bouton **« Voir l'étude de cas »** → `/projets/udixio-ui`.
- **Responsive** : sur mobile, empilement texte → vidéo → panneau preuve/CTA ; pas
  de bleed.
- La ligne verticale centrale du circuit (`Line fromX/toX=0.5`) au-dessus, dans et
  en-dessous de la carte est préservée.

**c) Bloc Développement multiplateforme (Flutter)** — reste juste après React & Motion.
- Conserver titre + sous-titre + paragraphe Flutter.
- Remplacer le `div.flex.flex-wrap` des 8 mini-cards (lignes ~188-244) par un
  **bandeau d'icônes** : une rangée fine, icônes monochromes (`text-on-surface-variant`
  / accent au survol), libellés courts sous chaque icône : Web (`iSelectWindow`),
  iOS (`faApple`), Android (`faAndroid`), Windows (`faWindows`), macOS (`faApple`),
  Linux (`faLinux`). Pas de conteneurs `*-container` colorés.

**d) Transitions de thème** — la dernière `LinearGradient` de FrontEndSection passe
de `nextTheme="blue"` à `nextTheme="green"` (c'était UxSection qui assurait la
transition vers le back-end vert). Vérifier visuellement la continuité du dégradé
des `Line` du bloc Flutter vers le back-end.

## Hors périmètre

- Création effective de la page `/projets/udixio-ui` (lien posé, page à venir).
- Modification de `HeroSection`, `BackEndSection`, `PhilosophieSection`, `FaqSection`.
- Suppression du fichier `sticky-scroll-reveal.tsx`.

## Validation

- Le circuit `Line` reste visuellement continu de Hero à Back-End (aucune rupture
  au niveau de l'ancienne UxSection retirée).
- La vidéo s'affiche comme visuel de React & Motion et mène à `/projets/udixio-ui`.
- Plus aucune mini-card plateforme colorée ; bandeau d'icônes épuré présent.
- Transition de couleur correcte vers le back-end vert.
