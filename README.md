# Aashish Pratap Sah — Creative Full-Stack Developer

React · TypeScript · Vite · Tailwind v4 · GSAP ScrollTrigger · Lenis · Framer Motion

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build
```

## Structure

```
src/
  config/site.ts        ALL editable content: contact links, about text, projects,
                        certificates (priority order), skills
  lib/smoothScroll.ts   Lenis ↔ GSAP ticker/ScrollTrigger bridge
  components/           Navbar, Loader, Lightbox, FilmStrip
  sections/             About, Marquee, Projects, Certificates, Skills, Contact
  hero/
    Hero.tsx            pinned section, scroll → progress, typography
    CameraPrints.tsx    camera ejects colour prints that grow as they fly to a pile
    VintageCamera.tsx   SVG rangefinder camera (knobs turn as prints wind out)
```

## Hero — camera prints

The hero pins for ~3.5 viewport heights. A small vintage camera sits in the
top-left corner; as you scroll, it ejects colour prints one at a time. Each
print leaves the camera's slot tiny and grows as it travels, landing full-size
on a loose pile (the next lands on top). Scrolling back returns them.

Frames live in `public/hero/reel/frame-01.webp … frame-08.webp` (900×1200, 3:4,
original colour). To change them:

1. Pick portrait photos and crop them to 3:4, chest-up, face roughly centred.
2. Export them as WebP, 900×1200, quality ~78.
3. Update the count/paths in `site.hero.reel` in `src/config/site.ts`.

Print and camera styles are `.print*` / `.prints-camera` in `src/index.css`.

## Content & media

- Project photos/video: `public/work/` · Certificates: `public/certs/` (WebP, rotated upright).
- To add a certificate: drop a WebP in `public/certs/` and add an entry to
  `certificates` in `src/config/site.ts` — its position in the list is its priority.
- To add a project: add an entry to `projects`; every `frames` item becomes one
  frame of that project's scroll-driven film strip (add `video` for a looping clip).
- Source material lives in `My projects and About ME/` (not published, not watched by Vite).
