# Charte Graphique IKONGA (Saison Lifestyle 2.0)

## 🎨 Palette de Couleurs "Warm Lifestyle"

### Couleurs Principales

| Nom | Hex | Usage | Variable CSS |
|-----|-----|-------|--------------|
| **IKONGA Orange** | `#FA8662` | Couleur primaire (Coral) | `--ikonga-orange` |
| **IKONGA Dark** | `#2D2D2D` | Titres, texte important | `--ikonga-dark` |
| **IKONGA Light** | `#FFF9F5` | Fond chaud (Ivoire) | `--ikonga-light` |
| **IKONGA Lilac** | `#ECE6FF` | Accents secondaires | `--ikonga-lilac` |
| **IKONGA Mint** | `#E7F6ED` | Messages de succès/info | `--ikonga-mint` |

### Dégradés & Accents

| Nom | Valeur | Usage |
|-----|--------|-------|
| **IKONGA Gradient** | `linear-gradient(90deg, #F79A32 0%, #E5488A 100%)` | Boutons CTA, Badges |
| **Text Gradient** | `-webkit-background-clip: text;` | Titres à fort impact |

---

## 📝 Typographie

### Familles de Polices

```css
/* Corps de texte, boutons, formulaires */
font-family: 'Poppins', sans-serif;

/* Titres (H1-H6) */
font-family: 'DM Serif Display', serif;
text-transform: uppercase;
letter-spacing: 0.5px;

/* Signature Script (Accents) */
font-family: 'Allura', cursive;
```

### Classes Spécifiques

- **.script-accent** : Allura, #FA8662, rotation -2deg, font-size 1.5em.
- **.text-gradient** : Applique le `ikonga-gradient` au texte.

---

## 🔘 Boutons "Soft Pill"

Les boutons évoluent vers un design plus organique et moins agressif.

### Style Principal (CTA)

```css
/* Apparence */
background: linear-gradient(90deg, #F79A32 0%, #E5488A 100%);
border-radius: 50px;
border: none;
color: #FFFFFF;
padding: 15px 30px;

/* Effets */
box-shadow: 0 4px 15px rgba(247, 154, 50, 0.3);
transition: all 0.3s ease;

:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(229, 72, 138, 0.4);
}
```

### Style Secondaire (Outline)

```css
background: transparent;
border: 2px solid #2D2D2D;
color: #2D2D2D;
border-radius: 50px;
```

---

## 📦 Composants Premium

### Card Signature
Conteneur avec une bordure dégradée fine et badge "OFFRE POPULAIRE" optionnel.
- Background interne : White
- Border : 3px (Gradient)
- Radius : 20px

### WooCommerce & E-commerce
- **Prix** : Poppins Bold, #2D2D2D.
- **Badges Promo** : Cercles, dégradé IKONGA.
- **Fiches Produits** : Radius 15px, bordure subtile, hover shadow.

---

## 📱 Adaptation Mobile

- **H1** : Réduction à 28px.
- **Boutons** : Passage en largeur 100% (Full Width) sur les écrans ≤ 768px.

---

**Version:** 2.0 (Lifestyle)
**Dernière mise à jour:** Février 2026
**Projet:** IKONGA Application
