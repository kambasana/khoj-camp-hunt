# Scene boards

Drop accepted 1536×1024 webps here, named exactly as in `game.js`:

```
ahmedabad-district-1.webp … ahmedabad-district-4.webp
jamnagar-district-1.webp … jamnagar-district-4.webp
kutch-district-1.webp … kutch-district-4.webp
navratri-district-1.webp … navratri-district-4.webp
surat-district-1.webp
patan-district-1.webp
junagadh-district-1.webp
garba-district-1.webp
```

Source of truth is the private repo `kambasana/hidden-gujarat`
(`dist/assets/districts/`). The Sync workflow copies them here.

Until those files land, Pages generates painted stand-ins and the
player also paints a canvas fallback so the hunt stays playable.
