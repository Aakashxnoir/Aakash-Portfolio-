# Learning Progress

## Security audit fixes (27 Oct 2026)
- Learner ran a full security audit, then asked for direct implementation of the fixes (karpathy-guidelines).
- Implemented (AI defaults): terminal `open` only matches own keys of the targets map (`Object.hasOwn`); site-wide headers in next.config.ts (`frame-ancestors 'none'`, `nosniff`, `strict-origin-when-cross-origin`). A full CSP was left out because it would need `'unsafe-inline'` and would block the no-JS mailto form. `.env.local` set to mode 600. `npm audit`: 0 vulnerabilities.
- Verified: build, test:motion 12/12, headers on pages and PDF, PDF viewer opens, console clean. Lint is clean for project source; the 260 lint errors all come from `.claude/worktrees/`.
- Résumé phone (PRD:190), decided 28 Oct: learner asked how recruiters would reach him without it (AI explained: email, LinkedIn, contact form; phone usually comes later), then chose "the safe option": the public PDF has no number, and the copy with it goes only to applications. AI removed the number from public/Aakash_Buddha_Kannan_Resume.pdf directly (no LaTeX on this machine) and saved the old copy to ~/Documents/Aakash/Aakash_Buddha_Kannan_Resume_with_phone.pdf.
- Demonstrated understanding: none recorded yet.

## Viewer-confusing OS labels (26 Oct 2026)
- Learner brought viewer feedback: `~/desktop` path bar, `aakash@noir-system:~$` timeline prompt, fake commit hashes. Asked for direct implementation (karpathy-guidelines).
- Learner chose (recommended options from a picker): path root `Desktop`; prompt `$`; hide hashes on cards and stop the `git show <hash>` command swap. Hashes and full prompt stay in the Extras terminal and boot screen.
- Implemented and verified (build, test:motion 12/12, 1440/1280/390, prod console clean). PRD and IMPLEMENTATION_PLAN updated.
- Demonstrated understanding: none recorded yet (picked options, no reasoning given).
- Follow-up (learner's instruction): app file names lose their extensions everywhere (`projects`, `timeline`, `profile`, `contact`); terminal `cat` takes the new names. `résumé.pdf`, `lights-out.exe`, `error.log` untouched.

## test:motion enforcement (decided 24 Oct 2026)
- Learner chose (from offered options): a pre-push git hook that runs `npm run build` and `npm run test:motion`, so a failing check blocks `git push`.
- Implemented: `.githooks/pre-push`, enabled with `git config core.hooksPath .githooks` (per clone). Also made test-motion's Chrome-profile cleanup best-effort (it crashed with ENOTEMPTY and would have blocked pushes).
- Verified: clean-env push to a scratch repo passed (12/12); push with broken Chrome was blocked.
- Demonstrated understanding: none recorded yet (picked from options, no reasoning given).

## Secrets audit (24 Oct 2026)
- Learner asked to "encrypt" safety features so no API is reachable from the frontend. AI explained: browser-side encryption can't hide a secret (the key ships too); the fix is keeping secrets off the client. Audit found none shipped; résumé PDF contains a phone-number-shaped string (PRD open item, learner to decide).

## Résumé view + download (24 Oct 2026)
- Learner chose: View and Download as two separate controls. Then asked for direct implementation (karpathy-guidelines), so placement and "view" meaning were AI defaults: all four spots (hero, menu bar right, File menu, contact), view = browser PDF viewer in a new tab.
- Introduced (AI explained): the `download` attribute on `<a>`.
- Implemented and verified (build, lint, test:motion, 1440/1280/375). Demonstrated understanding: none recorded yet.

## Motion entry bug (19 Oct 2026)
- Introduced (AI explained): localStorage vs sessionStorage lifetime; how the once-per-session boot flag gated all entry motion via the `entering` flag in Motion.tsx; why it was written that way (avoid a visible-then-hidden flash); the `enter` class + CSS visibility hold + 2s failsafe fix; static source checks vs runtime browser tests.
- Demonstrated understanding: none recorded yet.
- Needs reinforcement: not assessed.
