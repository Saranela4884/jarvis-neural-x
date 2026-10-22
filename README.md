# JARVIS NEURAL X — MARK VIII

A Royal Purple holographic **static website demo** designed for GitHub Pages. Includes an animated login screen, dashboard, English/Tamil built-in commands, optional browser speech features, and a service worker for offline reloads.

## IMPORTANT — DEMO LOGIN, NOT SECURE AUTHENTICATION

The local sign-up saves **username only** to browser localStorage. The password input is deliberately **not saved or verified**. This is purely a navigation demo; anyone using this browser can enter a saved username with any 6+ character demo password. **Do not enter a real password. Do not use this to protect private data.** For public accounts, integrate a reputable authentication service (e.g. Firebase Authentication, Supabase Auth) with appropriate configuration and authorization rules; this ZIP does not include real user accounts or a forgot-password feature.

## Run locally (Windows + VS Code)

1. Extract this ZIP.
2. Open folder `jarvis-neural-x` in VS Code.
3. Open VS Code Terminal, then run: `python -m http.server 5500`
4. Open http://localhost:5500 in Chrome or Edge.
5. Select **SIGN UP**, choose a demo username and any made-up password (6+ chars), then enter the dashboard.
6. Press Ctrl+C in Terminal to stop the server.

Do **not** open `index.html` with `file://` if you want PWA/offline cache; service workers need localhost or HTTPS.

## Publish to GitHub Pages

1. On GitHub, create a new public repository named `jarvis-neural-x`.
2. Upload the **contents** of the `jarvis-neural-x` folder to the repository root (`index.html`, `style.css`, `app.js`, etc.). Do not put the site inside an additional nested folder.
3. Go to **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
4. Select `main` and `/ (root)`, then Save.
5. When GitHub finishes publishing, open `https://YOUR_USERNAME.github.io/jarvis-neural-x/`.
6. Visit once while connected. Later, the website shell and built-in commands can work offline in that same browser if the service-worker cache remains stored. You can use your browser's **Install app** option where supported.

## Included files

- `index.html` — responsive login and dashboard pages
- `style.css` — Royal Purple neon interface and animated reactor
- `app.js` — local demo profiles, commands, optional speech input/output, particles
- `sw.js` — offline resource caching
- `manifest.webmanifest` — installable web app metadata
- `icon.svg` — custom local application icon

## Features and limitations

- Offline: cached website, built-in chat commands (`hello`, `time`, `date`, `help`, `who are you`, `offline`), local demo profiles.
- Browser voice output: depends on available speech voices/operating system.
- Browser voice recognition: may require internet, permission, and supported browser, so **not guaranteed offline**.
- This static project **does not provide real generative AI conversations**. Local Ollama on your Windows PC cannot run directly on GitHub Pages. Hosting a separate secure backend or running a local server would be a future upgrade.
- No Windows PC telemetry, Android ADB, command execution, or remote access in this website. This intentionally removes the desktop-only capabilities from your previous Python versions.
- Offline storage can be cleared by the browser. PWA installability differs by platform/browser.

## Security

Never commit API keys, real passwords, credentials, or private data to a public GitHub repository. Avoid exposing local Ollama directly to the internet. Do not copy this demo login as production security.
