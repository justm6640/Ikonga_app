# Charte Graphique IKONGA

## 🎨 Palette de Couleurs

### Couleurs Principales

| Nom | Hex | Usage | Variable CSS |
|-----|-----|-------|--------------|
| **Coral Primary** | `#fa8662` | Couleur principale, liens, boutons CTA | `--ast-global-color-0` |
| **Pink Accent** | `#ff559c` | Survol, états actifs | N/A |
| **Dark Slate** | `#1e293b` | Titres, texte important | `--ast-global-color-2` |
| **Medium Slate** | `#334155` | Texte du corps | `--ast-global-color-3` |
| **White** | `#FFFFFF` | Arrière-plans, texte sur fond sombre | `--ast-global-color-4` |
| **Light Blue Gray** | `#F0F5FA` | Arrière-plan secondaire | `--ast-global-color-5` |
| **Near Black** | `#111111` | Texte alternatif foncé | `--ast-global-color-6` |
| **Light Gray** | `#D1D5DB` | Bordures, séparateurs | `--ast-global-color-7` |
| **Footer Dark** | `#222222` | Arrière-plan footer | N/A |
| **Focus Blue** | `#046BD2` | Focus état des champs | N/A |

### États Interactifs

```css
/* Liens */
color: #fa8662;           /* Normal */
color: #ff559c;           /* Hover/Focus */

/* Sélection de texte */
background: #fa8662;
color: #000000;
```

---

## 📝 Typographie

### Familles de Polices

```css
/* Corps de texte, boutons, formulaires */
font-family: 'Poppins', sans-serif;

/* Titres (H1-H6) */
font-family: 'DM Serif Display', serif;
```

### Hiérarchie des Titres

| Élément | Taille Desktop | Taille Tablette | Taille Mobile | Line Height | Font Family |
|---------|----------------|-----------------|---------------|-------------|-------------|
| **H1** | 36px (2.25rem) | 30px (1.875rem) | 30px (1.875rem) | 1.4em | DM Serif Display |
| **H2** | 30px (1.875rem) | 25px (1.5625rem) | 25px (1.5625rem) | 1.3em | DM Serif Display |
| **H3** | 24px (1.5rem) | 20px (1.25rem) | 20px (1.25rem) | 1.3em | DM Serif Display |
| **H4** | 20px (1.25rem) | - | - | 1.2em | DM Serif Display |
| **H5** | 18px (1.125rem) | - | - | 1.2em | DM Serif Display |
| **H6** | 16px (1rem) | - | - | 1.25em | DM Serif Display |
| **Body** | 16px (1rem) | - | - | 1.65 | Poppins |

### Poids des Polices

```css
font-weight: 400;  /* Corps de texte normal */
font-weight: 500;  /* Boutons, labels, liens importants */
font-weight: 600;  /* Titres, éléments de blog */
font-weight: bold; /* Emphase forte */
```

---

## 🔘 Boutons

### Style Primaire (Fill)

```css
/* Apparence */
background-color: #fa8662;
border-color: #fa8662;
color: #000000;
border-style: solid;
border-width: 0;

/* Typographie */
font-family: inherit;
font-weight: 500;
font-size: 16px (1rem);
line-height: 1em;

/* Espacement */
padding: 15px 30px;           /* Desktop */
padding: 14px 28px;           /* Tablette (≤921px) */
padding: 12px 24px;           /* Mobile (≤544px) */

/* États */
:hover {
  background-color: #ff559c;
  border-color: #ff559c;
  color: #000000;
}
```

### Style Outline

```css
/* Apparence */
background-color: transparent;
border: 2px solid #fa8662;
color: #fa8662;
border-radius: 9999px;        /* Arrondi complet */

/* Espacement */
padding: 13px 30px;           /* Desktop */
padding: 12px 28px;           /* Tablette */
padding: 10px 24px;           /* Mobile */

/* États */
:hover {
  background-color: #ff559c;
  border-color: #ff559c;
  color: #000000;
}
```

### Border Radius

```css
border-radius: 4px;           /* Boutons standards */
border-radius: 9999px;        /* Boutons outline (pilules) */
```

---

## 📦 Composants de Formulaire

### Champs de Saisie (Input, Textarea, Select)

```css
/* Apparence */
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 24px;
width: 100%;

/* Espacement */
padding: 12px 16px;
height: 40px;                 /* Input uniquement */

/* Style */
border-radius: 4px;
box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
color: var(--ast-form-input-text, #475569);
border: 1px solid var(--ast-border-color);
background: var(--ast-global-color-5);

/* États */
:focus {
  border-color: #046BD2;
  box-shadow: none;
  outline: none;
}

::placeholder {
  color: #9CA3AF;
}
```

### Labels

```css
color: #111827;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: 20px;
```

### Fieldset

```css
padding: 30px;
border-radius: 4px;
```

---

## 📐 Espacement & Layout

### Conteneurs

```css
/* Conteneur normal */
max-width: 1200px;
margin: 0 auto;

/* Conteneur étroit */
max-width: 750px;
margin: 0 auto;
```

### Padding des Conteneurs

| Breakpoint | Padding |
|------------|---------|
| **≥1200px** | 2.5em |
| **922-1199px** | 2.5em |
| **768-921px** | 2em |
| **545-767px** | 2.5em |
| **≤544px** | 1.8em |

### Padding des Articles (Separate Container)

```css
/* Desktop (≥1201px) */
padding: 3em;

/* Tablette/Mobile */
padding: 1.5em 1em;           /* ≤544px */
```

### Marges Standards

```css
margin-bottom: 1.25em;        /* Widgets */
margin-bottom: 1.5em;         /* Articles, hentry */
margin-bottom: 2em;           /* Sections, descriptions */
```

---

## 🎭 Effets & Animations

### Ombres

```css
/* Boutons & formulaires */
box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

/* Badges de panier */
box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.3);
```

### Transitions

```css
transition: all 0.2s linear;  /* Panier, logo */
transition: all 0.3s ease;    /* Widgets panier */
```

### Border Radius

```css
border-radius: 4px;           /* Standard (boutons, inputs, fieldsets) */
border-radius: 6px;           /* Articles de blog */
border-radius: 2px;           /* Scroll to top */
border-radius: 99px;          /* Badges */
border-radius: 100%;          /* Avatars */
```

---

## 🧭 Navigation & Header

### Menu Principal

```css
/* Liens de menu */
color: var(--ast-global-color-3);    /* #334155 */

/* Hover */
color: var(--ast-global-color-1);    /* #fa8662 */

/* Current/Active */
color: var(--ast-global-color-1);    /* #fa8662 */
```

### Header Principal

```css
background-color: #FFFFFF;
border-bottom: 1px solid var(--ast-border-color);
min-height: 80px;
```

### Sous-menus

```css
border-top: 2px solid #fa8662;
border-bottom: 0;
border-left: 0;
border-right: 0;
```

---

## 🛒 Panier (Cart)

### Badge de Compteur

```css
/* Apparence */
background-color: #fa8662;
color: #000000;
font-family: 'Poppins', sans-serif;
font-weight: bold;
font-size: 11px;

/* Dimensions */
height: 18px;
min-width: 18px;
line-height: 17px;
padding-left: 2px;
padding-right: 1px;

/* Position */
position: absolute;
top: -10px;
right: -12px;

/* Style */
border-radius: 99px;
box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.3);
```

### Drawer Panier

```css
width: 460px;                 /* Desktop */
width: 80%;                   /* ≤921px */
width: 100%;                  /* ≤544px */
background-color: var(--ast-global-color-4);
```

---

## 🦶 Footer

### Footer Principal

```css
background-color: #222222;
padding-top: 45px;
padding-bottom: 45px;
```

### Footer Inférieur (Below Footer)

```css
background-color: #222222;
padding: 1px;
min-height: 60px;
```

### Copyright

```css
font-size: 10px (0.625rem);
color: var(--ast-global-color-3);
text-align: center;
```

### Liens Footer Menu

```css
color: var(--ast-global-color-5);  /* #F0F5FA */
padding: 0 20px;                   /* Tablette */
```

---

## 📱 Breakpoints Responsifs

```css
/* Desktop Large */
@media (min-width: 1201px) { }

/* Desktop */
@media (min-width: 922px) { }

/* Tablette */
@media (max-width: 921px) { }

/* Mobile */
@media (max-width: 544px) { }
```

### Taille HTML Responsive

```css
html {
  font-size: 100%;            /* Desktop */
  font-size: 91.2%;           /* ≤921px */
  font-size: 91.2%;           /* ≤544px */
}
```

---

## 🎯 Logo

### Dimensions

```css
/* Desktop */
max-width: 59px;
width: 59px;

/* Mobile (≤544px) */
max-width: 44px;
width: 44px;
```

---

## 🔄 Scroll to Top

```css
/* Apparence */
width: 2.1em;
height: 2.1em;
line-height: 2.1;
background-color: #fa8662;
color: #ffffff;
border-radius: 2px;
font-size: 15px;

/* Position */
position: fixed;
right: 30px;
bottom: 30px;
z-index: 99;

/* Icône */
.ast-icon.icon-arrow svg {
  width: 1.6em;               /* Desktop */
  width: 1em;                 /* ≤921px */
  transform: translate(0, -20%) rotate(180deg);
}
```

---

## 📋 Séparateurs

```css
/* Séparateur standard */
height: 0;
margin: 20px auto;

/* Séparateur sans style dots/wide */
max-width: 100px;

/* Séparateur avec background */
padding: 0;
```

---

## ✨ États Interactifs Globaux

### Focus Visible

```css
outline-style: dotted;
outline-color: inherit;
outline-width: thin;
```

### Focus Input

```css
border-style: dotted;
border-color: inherit;
border-width: thin;
```

---

## 🎨 Variables CSS Personnalisées

```css
:root {
  /* Couleurs globales */
  --ast-global-color-0: #fa8662;
  --ast-global-color-1: #fa8662;
  --ast-global-color-2: #1e293b;
  --ast-global-color-3: #334155;
  --ast-global-color-4: #FFFFFF;
  --ast-global-color-5: #F0F5FA;
  --ast-global-color-6: #111111;
  --ast-global-color-7: #D1D5DB;
  --ast-global-color-8: #111111;
  
  /* Bordures */
  --ast-border-color: var(--ast-global-color-7);
  
  /* Conteneur */
  --ast-container-width: 1200px;
  --ast-narrow-container-width: 750px;
  
  /* Espacement des blocs */
  --ast-default-block-top-padding: 3em;
  --ast-default-block-right-padding: 3em;
  --ast-default-block-bottom-padding: 3em;
  --ast-default-block-left-padding: 3em;
}
```

---

## 📚 Bonnes Pratiques

### 1. **Hiérarchie Visuelle**
- Utiliser DM Serif Display pour les titres (H1-H6)
- Utiliser Poppins pour le corps de texte
- Respecter les tailles de police définies

### 2. **Couleurs**
- Coral (#fa8662) pour les actions principales
- Pink (#ff559c) pour les états hover
- Respecter le contraste texte/fond

### 3. **Espacement**
- Utiliser les variables de padding définies
- Respecter les marges standards entre sections
- S'adapter aux breakpoints définis

### 4. **Responsive**
- Adapter les tailles de police
- Ajuster le padding selon les breakpoints
- Simplifier les layouts sur mobile

### 5. **Accessibilité**
- Utiliser les états focus visibles
- Maintenir un contraste suffisant
- Fournir des zones cliquables suffisantes (min 40px)

---

**Version:** 1.0  
**Dernière mise à jour:** Janvier 2025  
**Projet:** IKONGA Application
