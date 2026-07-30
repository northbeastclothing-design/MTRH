# MTRH Interactive Map Project Rules

## Image Integration Protocol
Whenever finding or adding new image resources to the map layers or cartography collections, you MUST automatically follow this verification protocol to prevent broken links:
1. **Mandatory Automatic Verification**: You are strictly required to write and run a synchronous Node.js image URL check script (using HTTP HEAD or GET requests with proper User-Agent headers) *automatically* every time you add any new image resource URLs, validating that they return a status code of `200 OK` (or `206 Partial Content`) and do not result in 400, 403, or 404 errors. Do not rely on 429 status codes as confirmation of a valid link; ensure you test correct endpoint names.
2. **Wikipedia/Wikimedia Commons Thumbnails**: Never hotlink raw, full-resolution Wikipedia original images, as they are often blocked by hotlinking referrers, too large for client WebGL uploads, or lead to 403/429 rate limit masks. Always query the Wikipedia API or format them as optimized thumbnail URLs (preferring standard widths like `1280px` or smaller fallbacks like `500px`). Ensure you test the final formatted thumbnail URLs, as requesting a size wider than the original image returns a `404 Not Found` error.
3. **Forbid Raw URLs / Ensure `/thumb/` Format**: Every Wikipedia/Wikimedia Commons URL MUST contain the `/thumb/` directory structure (e.g., `https://upload.wikimedia.org/wikipedia/commons/thumb/...`). Raw files (e.g. `https://upload.wikimedia.org/wikipedia/commons/x/xx/file.jpg`) are blocked by Wikipedia's hotlinking protection in client browsers and will fail to load. If the Wikipedia API returns a raw URL (which happens when the requested thumbnail size is larger than the original image), you must query a smaller size (e.g. `500`, `400`, `300`, or `220`) to force the API to return a `/thumb/` version.
4. **Resolution Bounds**: Verify that no image exceeds 4000px in width/height to avoid client-side GPU WebGL texture upload failures.
5. **Handling Connection Timeouts & Firewall Blocks**: If an external image domain blocks direct programmatic connections (resulting in `ERR_CONNECTION_TIMED_OUT` timeouts on HEAD/GET requests), verify the links offline against the website's crawled HTML files to guarantee they are genuine. To allow the browser to load these blocked assets successfully, route the image URLs through the high-reliability global Cloudflare CDN image proxy **`images.weserv.nl`** (e.g. prefixing them with `https://images.weserv.nl/?url=`) in the `cleanAndProxyImageUrl` helper function in both `src/App.tsx` and `src/CodexPage.tsx`.
6. **WordPress Suffix Stripping**: When stripping size suffixes from WordPress thumbnails to resolve full-size images, ensure the regex handles double dashes before the size (using `/-+\d+x\d+(\.[a-zA-Z0-9]+)$/`) to avoid leaving a trailing dash (e.g., `filename-.jpg`) which results in `404 Not Found` errors.
7. **Mandatory Metadata Provision**: Whenever adding any new items or locations to the database or Codex tree, you MUST always assign relevant category tags/layers and include valid, accessible image URLs (such as size-optimized Wikipedia/Wikimedia Commons thumbnails containing `/thumb/` that have been verified using our Node.js script). Never add placeholder or bare nodes without tags and images.


## Color Palette Constraint Rule
When choosing or changing colors for map layers, pins, themes, or UI components, you MUST ONLY choose colors from the existing project palette below (unless explicitly requested otherwise by the user). When a new color is approved by the user, add it to this list.

### Existing Project Color Palette
* `#FF9BE1` (UFOs - War.gov / Light Pink)
* `#B297FF` (UFOs - Brazillian Archives / Violet)
* `#FF9F63` (Enochian Sites / Orange)
* `#ECCE81` (Giants & Nephilim / Gold-Tan)
* `#90C2FF` (Biblical Figures / Blue)
* `#90E9FF` (Particle Accelerators / Ice Blue)
* `#FFF96A` (Myths / Legends / Yellow)
* `#91FFC4` (Biblical Events / Mint Green)
* `#C2FFBD` (UFOs - Sightings / Light Green)
* `#C6986D` (Bigfoot Sightings / Brown)
* `#AFFFEC` (Cryptid Sightings / Pale Turquoise)
* `#D3C5FB` (Underworld Entrances / Light Purple)
* `#F9B6DB` (Portals / Stargates / Pink)
* `#F7E8C1` (Ancient Texts / Pale Sand)
* `#FFABA6` (Rock Art & Cave Paintings / Peach-Pink)
* `#59DCB7` (Masonic Lodges / The Occult / Teal)
* `#BCA7C7` (Ancient People Groups / Muted Lavender)
* `#B5CED5` (Old World Structures / Slate Blue-Gray)
* `#E7EC5B` (Vanished Ships / Aircraft / Lime-Yellow)
* `#b6a6ff` (Default / Purple-Blue)


## Codex Node & Layer Color Mapping Consistency Protocol
Whenever adding or updating a root category/layer in the Map, Timeline, or Codex:
1. **Define in LAYER_COLORS / LAYER_CONFIG**: Add the layer name and color mapping to `LAYER_COLORS` and `LAYER_ICONS` in `src/CodexPage.tsx`, and `LAYER_CONFIG` in `src/App.tsx`.
2. **Explicitly Map in `getNodeColor`**: If the layer maps to a root node in `TERM_TREE_DATA` (defined in `src/termTreeData.ts`), you MUST explicitly map its root node ID to its theme color in the `getNodeColor` function in `src/CodexPage.tsx`. Do not let it fall back to the default purple-blue (`#b6a6ff`).
3. **Contrast Adjustments**: Add the corresponding contrast-adjusted dark color for the light mode theme in `adjustColorForContrast` inside `src/CodexPage.tsx`.


