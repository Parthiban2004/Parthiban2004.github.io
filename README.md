# Parthiban — Portfolio

A futuristic, minimal personal portfolio built with plain HTML, CSS and JavaScript. It has no build step and no dependencies.

## Features
- Loader animation, then a large reveal of the name with a typing role line
- Particle background that reacts to the mouse, a grid overlay, and a spinning orb with parallax
- Floating buttons that bob, react magnetically to the mouse and show tooltips, plus a floating dock with LinkedIn, GitHub and Back to top
- Pill-shaped navbar with a sliding indicator that highlights the current section, hides while you scroll down, and has a mobile menu
- An experience card (Accenture, Cloud Data Engineer) with an animated data-pipeline line
- A small animation for each project that plays when it scrolls into view: equalizer tracks for stem separation, a code editor with an AI hint for the coding platform, and a heartbeat line with an accuracy gauge for the cardiovascular model
- Certification cards with a light sweep on hover
- Content fades in with a blur as you scroll, cards tilt in 3D with a spotlight, and a marquee scrolls across the page
- Custom cursor, scroll progress bar, and support for the reduced-motion setting

## Run
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Customize
- **Text**: edit `index.html` (about, experience, projects, certifications, links).
- **Typing roles**: edit the `roles` array in `script.js`.
- **Colors**: change the CSS variables at the top of `style.css`. `--accent` is the only accent color.

## Deploy
Push to GitHub and turn on **Settings → Pages → Deploy from branch**.
