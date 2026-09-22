# Khoj — Hidden Gujarat hunt

Public PWA for a Where’s-Wally-style hunt through painted Gujarati districts.

**Play:** https://kambasana.github.io/khoj-camp-hunt/

Private source of truth: [`kambasana/hidden-gujarat`](https://github.com/kambasana/hidden-gujarat)

```
hidden-gujarat          khoj-camp-hunt
art + engine + tests    public host / Pages / PWA
dist/assets/districts → img/scenes/
```

## Modes

- Level camps — painted places, unlock in order
- Endless — new seed each wave
- Hints Open or Locked
- EN / ગુ / both

## Deploy

GitHub Pages deploys from `main` via `.github/workflows/pages.yml`.

Cloudflare Pages (optional):

1. Create application → Connect `kambasana/khoj-camp-hunt`
2. Framework: None. Build command empty. Output: `/`
3. Live at `https://khoj-camp-hunt.pages.dev`

## Sync boards

In `hidden-gujarat` add secret `PUBLIC_PWA_TOKEN` (Contents write on this repo),
then run **Sync accepted boards to public PWA**.

Or copy by hand:

```
cp hidden-gujarat/dist/assets/districts/*-district-*.webp img/scenes/
```

Skip `*-preview.webp`. Until boards arrive, the Pages workflow paints stand-ins
and the player falls back to a canvas scene so the hunt still runs.
