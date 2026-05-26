# Reading Streak Heatmap (Issue #608) — Implementation Checklist

- [ ] Add Reading Streak UI section + ids + script include to `frontend/pages/library.html`
- [ ] Add streak heatmap glassmorphism + cell intensity + current/longest typography to `frontend/css/style.css`
- [ ] Add responsive overflow/size safeguards to `frontend/css/style-responsive.css`
- [ ] Wire `reading-streak.js` via ids and ensure `DOMContentLoaded` init runs
- [ ] Verify localStorage persistence under `bibliodrift-reading-streak`
- [ ] Verify streak calculations (current from today backward, longest consecutive)
- [ ] Manual test light/night + refresh + duplicate click prevention

