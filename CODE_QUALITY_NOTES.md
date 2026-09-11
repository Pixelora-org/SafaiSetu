# Code Quality Issues (Non-Blocking)

**Date:** 2026-09-10  
**Status:** Non-critical, should fix but not blocking launch

These linting warnings were found during the audit. They don't break functionality but should be addressed for code quality:

## React Hooks: setState in useEffect

### Issue
Several components call `setState` directly within `useEffect` bodies, which can cause cascading renders and hurt performance.

### Affected Files

1. **`src/components/admin/AdminQueue.tsx` (line 51)**
   ```tsx
   useEffect(() => {
     void load();  // ← load() calls setRows() and setAllowed()
   }, []);
   ```
   **Fix:** Extract data fetching to a mount hook or use a flag to prevent cascading renders.

2. **`src/components/layout/WelcomeSheet.tsx` (line 10)**
   ```tsx
   useEffect(() => {
     if (!window.localStorage.getItem("safaisetu-welcome")) setOpen(true);
   }, []);
   ```
   **Fix:** Use lazy initialization or move check to initial state:
   ```tsx
   const [open, setOpen] = useState(() => 
     !window.localStorage.getItem("safaisetu-welcome")
   );
   ```

3. **`src/components/map/LiveMap.tsx` (line 64)**
   ```tsx
   useEffect(() => {
     try {
       const raw = window.localStorage.getItem(STORAGE_KEY);
       if (!raw) return;
       const parsed = JSON.parse(raw) as LayerId[];
       const known = new Set(LAYER_META.map((l) => l.id));
       const next = parsed.filter((id) => known.has(id));
       if (next.length) setLayers(new Set(next));  // ← setState in effect
     } catch {
       /* keep defaults */
     }
   }, []);
   ```
   **Fix:** Use lazy initialization for initial state from localStorage.

## Reference
- [React Docs: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- ESLint rule: `react-hooks/set-state-in-effect`

## Priority
- **Low** — These are performance optimizations, not bugs
- Recommended to fix before scaling to 10k+ users
- Can be addressed in a separate PR after launch

## Fixed Issues

✅ **`src/app/not-found.tsx`** — Replaced `<a>` with `<Link />` for Next.js navigation (fixed in this audit)
