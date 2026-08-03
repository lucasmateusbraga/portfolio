# lucasbraga - portfolio

Static site (plain HTML/CSS/JS, no build step), ready to publish on GitHub Pages.
Content is bilingual (English default, Portuguese toggle) across every page.

## Structure

```
index.html              -> homepage (single page, scroll)
css/styles.css           -> shared styles for every page (same design system everywhere)
js/script.js              -> shared behavior: mobile nav, scroll-spy, language toggle, contact form
assets/img/               -> images used across the site
projetos/bb.html          -> Banco do Brasil x Leapfone case
projetos/leapfone.html    -> Leapfone institutional redesign case
projetos/smiles.html      -> Gol Clube Smiles+ case
```

All four pages (`index.html` and the three under `projetos/`) share the exact same
`css/styles.css` and `js/script.js`, so the visual identity, navigation and language
toggle behave identically everywhere. There is no per-project theme.

## How the language toggle works

Every translatable element carries `data-en="..."` and `data-pt="..."` attributes.
`js/script.js` swaps `innerHTML` between the two based on the flag button clicked
(🇬🇧 EN / 🇧🇷 PT) in the nav, and remembers the choice in `localStorage` so it stays
consistent as the person navigates between the homepage and the project pages.

To edit copy, edit both attributes on the element, for example:

```html
<h2 data-en="Selected work." data-pt="Seleção de projetos.">Selected work.</h2>
```

The visible text inside the tag is only what renders before JavaScript runs (English,
since that's the default language), the attributes are the source of truth once the
page loads.

## Before publishing, 3 things to set up

1. **Contact form (Formspree)**
   Create a free account at [formspree.io](https://formspree.io), create a form and copy the endpoint.
   In `index.html`, replace:
   ```html
   <form class="contact-form reveal" action="https://formspree.io/f/SEU_FORM_ID" method="POST">
   ```
   with your real endpoint (`action="https://formspree.io/f/xxxxxxx"`). Without this the form shows a warning instead of sending.

2. **LinkedIn and email**
   Already filled in with `https://www.linkedin.com/in/mateuscruzb/` and `lucasmateuspessoal@gmail.com` across `index.html` and the project pages. Just double-check they're right.

3. **New project pages later**
   To add a fourth project, duplicate one of the files in `projetos/` as a starting template (same header, nav, footer, and section structure), it will automatically match the rest of the site since it uses the same stylesheet and script.

## Publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `portfolio`, or `yourname.github.io` if you want it at the root of your GitHub domain).
2. Upload everything inside this folder to the root of the repository (not inside a subfolder).
3. In the repository: **Settings > Pages > Source: Deploy from a branch > Branch: main / (root)**, then **Save**.
4. In a minute or two the site goes live at `https://yourname.github.io/repository-name/` (or your custom domain, if you set one under Settings > Pages > Custom domain).

## Run locally before publishing

No installation needed, just open `index.html` in a browser. To test it the way it will behave on a server (recommended, so the project page links and the form behave the same), from this folder run:

```
python3 -m http.server 8000
```

and open `http://localhost:8000`.
