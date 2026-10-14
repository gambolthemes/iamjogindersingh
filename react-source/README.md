# Joginder Singh — React Portfolio

A responsive, React portfolio with a fixed icon sidebar, rotating greetings, project cards with real screenshots, mobile navigation and a print-ready resume. Built with React + Vite. No server, database or paid service is required. Work cards use real screenshots from public/work/.

## Quick start

Install Node.js 22.12+ (or a compatible later LTS). In this folder run:

    npm ci
    npm run dev

Create the upload build:

    npm run build

Preview the build locally:

    npm run preview

## Make it yours BEFORE publishing

1. Edit `src/profile.js`: add your real public email and LinkedIn/GitHub links (empty social links are hidden), plus optional portrait/resume paths. To make the enquiry form deliver messages, set `formEndpoint` (see `public/contact.php`, or a Formspree URL) or set `email` for an email-draft fallback. With neither, the form says it is not connected yet.
2. Put your own photo in `public/portrait.jpg`, then set `portrait: './portrait.jpg'`. The default graphic is an intentional typographic monogram.
3. Edit `public/resume.html` to add your verified contact details, employment dates and education. They have not been invented. Its button opens the browser print dialog; choose Save as PDF. Alternatively place a finished PDF in `public/` and set `profile.resume`.
4. Add or edit work in `src/profile.js` (`clientWork`, `hubtoolify.tools`, `gambolthemes.products`). Put a screenshot with the matching file name in `public/work/`. Confirm you have permission before publishing client work.
5. Edit `index.html` title/description if needed. Run `npm run build` after every change.

## Hostinger upload

The separate `hostinger-upload.zip` contains the initial production build. To publish that version, extract its contents into your domain's web root (normally `public_html`) using Hostinger File Manager. `index.html`, `resume.html`, `favicon.svg` and `assets/` must sit directly in the web root — not inside a nested dist folder. Back up any existing site before replacing files. Do not upload source files or node_modules.

After customizing, run `npm run build`, then upload the CONTENTS of `dist/` instead. This is a single-page anchor-based website: no React Router rewrite or Node.js hosting is needed. Relative asset paths also support subfolder deployment. Open it through your domain, not by double-clicking index.html. Enable SSL in your hosting and check the HTTPS URL. A cache refresh may be needed after replacing a previous version.

Typography uses Google Fonts, with local system-font fallbacks if unavailable. React and CSS are bundled locally. No tracking, cookies, fake testimonials, client statistics or unverified experience durations are included.

## Checks

Production build was checked in the creation environment. Browser-based visual and interaction QA was not available there. Before publishing, check mobile/desktop layouts, section navigation, keyboard navigation, dialog close/Escape, email links after configuration, and resume printing.
