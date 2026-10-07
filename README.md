# Huber Heating & Air Conditioning website preview

Independent website concept for presentation. This project is not represented as commissioned or approved by Huber. Research observed on October 7, 2026.

A build-free, mobile-first website using semantic HTML, CSS and minimal JavaScript. There are no application dependencies, remote fonts, analytics, cookies, generated photographs or backend.

## Run locally

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. The root index.html is the production entry point. assets/styles.css and assets/site.js use relative paths compatible with GitHub Pages project URLs. .nojekyll disables Jekyll processing.

## Publication

Target: a public GitHub repository named huber-heating-air-preview, main branch, GitHub Pages from main / (root). Deployment status and URLs are recorded in docs/QA_REPORT.md after verification. Do not treat local success as a completed public deployment.

## Request flow

Calls use tel:+19405533290. Email links use mailto:jameshuber56@yahoo.com. The form validates a name, phone and service selection, then creates a percent-encoded mailto draft. The visitor must open their email app and send the draft. No data is transmitted by the form, stored in browser storage or submitted to an endpoint. The form clears a prepared draft when details change. A request does not confirm an appointment.

Without JavaScript, the form controls remain disabled, preventing an accidental native GET submission. Without JavaScript or an email client, the direct phone/email contact remains available. No promise is made about response time. The supplied public contact details are not proof of mailbox deliverability or current scheduling capacity.

## Preview protections

Every page includes noindex, nofollow. robots.txt is deliberately omitted so crawlers can read the noindex directive. This is indexing guidance, not access control. The footer identifies the independent concept. HVACBusiness JSON-LD contains only the observed name, phone and address; the preview URL is not presented as the official business URL.

## Documentation

- docs/RESEARCH.md: evidence, provenance, conflicts and owner confirmations.
- docs/ASSET_SOURCES.md: original assets and omissions.
- docs/QA_REPORT.md: measured checks, deployment and limitations.
- CREATIVE_DIRECTION.md: concept identity and visual decisions.
- SITE_STRATEGY.md: visitor journey and conversion logic.
- SELF_CRITIQUE.md: tradeoffs and what would improve a production launch.

## Maintain

Edit the three source files directly. Recheck cited business information before changing claims. Re-run the browser QA script at scripts/qa.cjs with a local or published URL. It uses the Playwright library supplied by the Codex desktop runtime, rather than a site dependency. Set PLAYWRIGHT_MODULE_PATH if using a different runtime.

```sh
node scripts/qa.cjs http://127.0.0.1:4173 local
```

Do not add production promises, tracking or a real submission service without updating the privacy and request language. Confirm ownership, services, hours, coverage, brand authorization and asset rights before using this concept as an official business website.