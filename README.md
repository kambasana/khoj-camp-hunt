# Khoj — Camp Hunt PWA

Procedural Where’s-Wally-style camp hunt. Crowds are kit-built (age, sex, build, hair, hat, clothes, held item, pose) and dropped into Gujarati-flavoured camps.

Live repo: https://github.com/kambasana/khoj-camp-hunt

## Hook to Cloudflare Pages

1. Open [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. **Create application → Pages → Connect to Git**
3. Select `kambasana/khoj-camp-hunt`
4. Settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
5. Deploy. You get `https://khoj-camp-hunt.pages.dev` (or your project name).
6. Optional: attach a custom domain.

Later pushes to `main` auto-deploy.

## Local

```
npx serve .
```

## Modes

- Level camps — 10 themed maps, unlock in order
- Endless — new seed each wave

Hints can be Open (unlimited) or Locked.
