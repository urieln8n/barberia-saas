# BarberiaOS provisional brand spec

Source: no reference URL or screenshot was attached after selecting "Match a reference site / screenshot". This spec is provisional and derived from the active Neutral Modern system plus the requested dark, modern, professional, brutalist tone.

## Tokens

```css
:root {
  --bg:      oklch(18% 0 0);
  --surface: oklch(99% 0 0);
  --fg:      oklch(99% 0 0);
  --muted:   oklch(54% 0 0);
  --border:  oklch(92% 0 0);
  --accent:  oklch(58% 0.18 255);

  --font-display: 'Inter', -apple-system, system-ui, sans-serif;
  --font-body:    'Inter', -apple-system, system-ui, sans-serif;
  --font-mono:    ui-monospace, 'JetBrains Mono', monospace;
}
```

## Layout posture

- Dark background, white operational surfaces, hard grid lines.
- Cobalt accent reserved for CTAs, the brand mark, and one active product state.
- Brutalist density without roughness: sharp divisions, direct copy, no decorative icons.
- Mobile-first composition: sticky CTA, large headline, product mock visible in the first viewport.
- Rounded corners stay at the Neutral Modern 8-12px range; no soft shadows or gradients.
