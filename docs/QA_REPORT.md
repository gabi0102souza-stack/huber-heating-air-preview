# QA report

Observation date: October 7, 2026. Local verification finished at 22:06 UTC (19:06 in Sao Paulo).

## Deployment

- Public URL: https://gabi0102souza-stack.github.io/huber-heating-air-preview/
- Repository: https://github.com/gabi0102souza-stack/huber-heating-air-preview
- Branch: main. GitHub Pages source: main / (root), HTTPS enforced.
- Deployment status: BUILT. The initial Pages workflow completed successfully: https://github.com/gabi0102souza-stack/huber-heating-air-preview/actions/runs/37694222838
- Core site revision tested: 5363002a96ac084d95f77e60160b02ddfbc95784. The following documentation/evidence commit does not change index.html, CSS or site JavaScript.
- Published browser verification started at 22:12 UTC (19:12 in Sao Paulo) on October 7, 2026. Full results: [published-results.json](qa/published-results.json).
- Public HTML and both assets return HTTP 200, with the correct content types. Phone, email, anchors, form behavior, keyboard focus and responsive layout were rechecked on the published domain.

## VERIFIED: published browser tests

| Viewport | Layout | Form/links | 200% text | Accessibility |
| --- | --- | --- | --- | --- |
| 360 px mobile | PASS | PASS | PASS | 0 automatic violations |
| 390 px mobile | PASS | PASS | PASS | 0 automatic violations |
| 768 px tablet | PASS | PASS | PASS | 0 automatic violations |
| 1440 px desktop | PASS | PASS | PASS | 0 automatic violations |

No console exceptions, failed requests, external font/image loads or data submissions were observed. The no-JavaScript fallback also passed on the public URL. Screenshots of the public desktop, mobile form and 200% mobile text were opened and visually inspected.

- [Published desktop](qa/published-1440.png)
- [Published mobile 360 px](qa/published-360.png)
- [Published mobile 390 px](qa/published-390.png)
- [Published tablet](qa/published-768.png)
- [Published mobile form](qa/published-390-request.png)
- [Published desktop form](qa/published-1440-request.png)
- [Published mobile text at 200%](qa/published-360-text-200.png)

## VERIFIED: local browser tests

Chrome headless through bundled Playwright. Full machine-readable results: [local-results.json](qa/local-results.json). The source is scripts/qa.cjs. axe-core 4.11.0 was downloaded from the npm registry and integrity-checked; it is a QA tool, not a website runtime dependency.

| Viewport | Layout and anchors | Form | Keyboard/reduced motion | 200% text | Accessibility |
| --- | --- | --- | --- | --- | --- |
| 360 px mobile | PASS, no horizontal overflow | PASS | PASS | PASS | 0 automatic violations |
| 390 px mobile | PASS, no horizontal overflow | PASS | PASS | PASS | 0 automatic violations |
| 768 px tablet | PASS, no horizontal overflow | PASS | PASS | PASS | 0 automatic violations |
| 1440 px desktop | PASS, no horizontal overflow | PASS | PASS | PASS | 0 automatic violations |

Checks covered:

- Full content, semantic landmarks, one h1, English language and heading structure.
- Every internal anchor resolves. The mobile action bar appears only at narrow widths.
- Phone links use +19405533290; email links point to jameshuber56@yahoo.com.
- Estimate and problem/service actions correctly select service and request intent.
- Required fields, whitespace-only names, invalid phone and invalid email are rejected.
- Generated mailto recipient, estimate subject, service value and special-character encoding are correct.
- Draft status states nothing has been sent; focus transfers to the email-draft action.
- Editing details removes stale draft links. No form transmission or browser storage occurs.
- With JavaScript disabled, form controls are disabled and direct phone/email/noscript guidance remain available.
- Keyboard skip link, visible focus styles and reduced-motion scroll behavior work.
- Text at 200% has no horizontal page overflow at all four sizes. The mobile header was corrected after the expanded-text test exposed overflow.
- HTML, CSS and JavaScript return HTTP 200 locally. No console exceptions or failed network requests.
- Metadata includes noindex, nofollow, description and basic Open Graph; minimal HVACBusiness data contains only name/address/phone.
- Public copy contains no em dash. Concept footer is visible.

## Visual inspection

Viewport captures were opened and inspected for desktop hero, services, reviews, request form and contact, as well as the mobile hero and form. The spacing, typography, section alignment and form controls remain readable. Screenshots are source evidence, not mockups.

- [Desktop](qa/local-1440.png)
- [360 px mobile](qa/local-360.png)
- [390 px mobile](qa/local-390.png)
- [Tablet](qa/local-768.png)
- [Desktop form](qa/local-1440-request.png)
- [Mobile form](qa/local-390-request.png)
- [Service rows](qa/local-desktop-services.png)
- [Reviews](qa/local-desktop-reviews.png)

axe reported one incomplete contrast check for the textarea because the fixed mobile bar obscured part of it at the audit scroll position. Manual color calculation confirmed foreground #222621 on white at 15.36:1 and placeholder #61675e on white at 5.82:1. Both exceed 4.5:1. Automatic zero violations plus these checks do not constitute a complete accessibility certification or screen-reader/device study.

## Performance

Uncompressed first-load source sizes are about 33 KB combined: HTML approximately 14.5 KB, CSS 15.6 KB, JavaScript 2.8 KB. Three site requests, zero remote fonts, zero photographs, zero third-party scripts and no application dependencies. System fonts eliminate external font loading and associated font-swap layout shifts.

WebP/AVIF, responsive image variants and image lazy loading are not applicable to this image-free version. No Lighthouse or field Core Web Vitals score is claimed. Published behavior was tested on the actual domain. No throttled performance score or real-user measurement was collected.

## External links and contact limits

Review source links point to the retrieved Birdeye business listing. Google Maps uses its supported search URL and the exact matching name/address. The paths and URL encoding were checked. Every phone/email target was inspected. QA does not dial the business, send an email, validate mailbox deliverability or guarantee how a visitor's phone/email app handles a protocol link.

## INFERENCE

The lightweight architecture should reduce load cost. This is supported by the resource count and size, not an asserted field performance score. The call-first flow is a design decision, not evidence of higher conversion.

## NEEDS OWNER CONFIRMATION / limitations

Real phones, Safari/iOS, Android dialers, real email clients and screen-reader interaction were not tested. Directory data may be outdated; hours and location coverage require confirmation. No backend, appointment confirmation, official Facebook, authorized photos, emergency promise, pricing, financing, license badges or partner-brand claims are included. The complete owner checklist is in RESEARCH.md.