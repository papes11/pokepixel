# Maintenance Mode Toggle Guide

## Quick Toggle (Simple Method)

### How to Enable/Disable Maintenance Mode:

1. Open `pages/index.tsx`
2. Find this line near the top:
   ```typescript
   const MAINTENANCE_MODE = false;
   ```
3. Change it to:
   - `true` - To show maintenance page
   - `false` - To show the game

4. Save the file - the page will auto-reload!

**That's it!** No rebuild needed in development mode.

---

## What Was Changed

### Files Modified:
1. **`pages/maintenance.tsx`**
   - Now uses the Gameboy component (same structure as main game)
   - Shows "UNDER MAINTENANCE..." text in the screen area
   - Uses Game Boy green color scheme (#9bbc0f)
   - Fully responsive with the Gameboy CSS

2. **`pages/index.tsx`**
   - Added `MAINTENANCE_MODE` constant toggle
   - Imports the maintenance page
   - Conditionally renders maintenance or game based on the flag

---

## Customization

Edit `pages/maintenance.tsx` to customize:
- Message text (currently "UNDER MAINTENANCE...")
- Colors (currently using classic Game Boy green)
- Font sizes
- Add animations or additional text

---

## Example

```typescript
// In pages/index.tsx

// Show maintenance page
const MAINTENANCE_MODE = true;

// Show game (normal mode)
const MAINTENANCE_MODE = false;
```

---

## Notes

- Both pages use the same Gameboy component for consistency
- The maintenance page has animated blinking dots
- All Gameboy controls still work (they just don't do anything during maintenance)
- For production, set the flag before running `npm run build`
