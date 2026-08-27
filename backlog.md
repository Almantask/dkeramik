# DKeramik backlog

Ideas for building something people would **need** and **love** — grounded in a review of the live site ([github.io/dkeramik](https://almantask.github.io/dkeramik/)), the shop API, and the codebase. This is a product backlog, not a task dump. Items are ordered by how much they would change whether a stranger becomes a customer, then a person who cares.

---

## What the site is today

DKeramik is Donata’s handmade ceramics studio in Kaunas. The site already has a real shop behind it: bilingual LT/EN pages, cart and checkout, invoices, Paysera or SEPA, pickup in Kaunas, Lithuanian shipping, legal pages, and an admin panel for stock and orders.

The public face is still a **beautiful brochure with placeholder drawings**. Home is a poem on a beige gradient. Shop and portfolio show the same eight SVG bowls and cups. About promises photos and shows empty boxes. Contact opens a mail client. The craft process page exists but is not in the menu.

That gap matters more than any missing feature. People buy handmade ceramics with their eyes and their trust. Right now they get the voice without the object.

---

## What already works (keep this)

- **A clear reason to exist.** Not “pottery shop.” Homes become homes through small, heartfelt details. That is a feeling people already want.
- **A maker people can root for.** Donata left office life in Vilnius, moved to Kaunas, and traces the work back to her mother’s handmade pieces. That story is rare and true — most shops invent a founder myth.
- **Objects that belong to daily life.** Morning mug, dinner bowl, tea pair, candle trio, planter. These are rituals, not gallery sculptures.
- **Serious shop plumbing.** Stock, invoices, consumer-law pages, bilingual checkout. Most maker sites never get this far.
- **Tone.** Warm, unhurried, Lithuanian-first. Do not flatten this into generic e-commerce copy.

---

## Who would need this, and what they would love

| Person | What they need | What they would love |
| --- | --- | --- |
| Someone making a rental or new home feel theirs | One object that is not from a catalogue | A mug or bowl they chose, with a maker’s name attached |
| A gift-giver (birthday, housewarming, wedding, host) | Something personal that will actually be used | A tea-cup pair or candle set that arrives as a gift, not a parcel of inventory |
| A repeat morning-coffee person | A cup with the right weight and lip | The same form again when theirs chips — or a wait for the next firing |
| Lithuanians abroad | A piece of home that ships | A story they can give, not just an object |
| Curious Kaunas locals | A Saturday that is not shopping | A studio visit, pickup that feels like meeting Donata, or a first throwing class |
| Someone who wants a *set*, not a souvenir | Matching tableware over time | “Start with two, add the bowl later” instead of one-off leftovers |

Love here is not more pages. It is **seeing the clay, trusting the maker, getting the piece into their hands, and having a reason to come back.**

---

## What is blocking that today

1. **No real photographs.** Ceramics is glaze, weight, and light. SVG icons cannot create desire.
2. **Home does not sell.** The two buttons are Portfolio and About. Shop is in the nav but not in the invitation.
3. **The shop looks empty even when it is not.** The API currently has buyable pieces (morning mug €32, bud vase €28, candle trio €42). On the live shop, items first appear as “Išparduota” with the word “Kaina” instead of a price. Whether that is a loading flash, a failed API call, or inventory not reaching the page, the effect is the same: the store feels closed.
4. **Sold out is a dead end.** Unique work *should* sell out. The site treats that as failure instead of “tell me when the next one is ready” or “commission something like it.”
5. **Custom work is promised, not offered.** About and contact mention individual orders; there is no brief, timeline, or deposit path — only mailto.
6. **Portfolio and shop are twins.** Same eight pieces, thinner shop product pages (no dimensions, care, or gallery), names on portfolio cards only on hover (invisible on a phone).
7. **Trust is incomplete.** No packing photos, no “what if it breaks,” no studio face, no Instagram, no reviews from people who already live with a piece.
8. **The URL looks like a project, not a studio.** `almantask.github.io/dkeramik` does not match the care of the copy. `dkeramik.lt` is already named in the legal text.

---

## North star (one sentence)

**Help someone fall in love with a piece, trust Donata enough to pay, and then live with it — and come back when they want the next ritual object, a gift, or time in the studio.**

Build toward that. Decline features that only make the site busier.

---

## Now — make it real

Until these are true, extra features will not create love.

### B1. Photograph the work as it is actually used
**Need:** People cannot buy what they cannot see.  
**Love:** Close-ups of glaze and rim; a mug in a real morning kitchen; a bowl on a table with food; hands (Donata’s) in clay. Mix studio shots with lived-in shots. Replace every SVG and the empty About frames.  
**Outcome:** Home, shop, portfolio, and About use real photos. One hero image on the homepage. Product galleries show the piece, a detail, and a “in a home” frame.

### B2. Put something buyable on the first screen
**Need:** A visitor who already wants a handmade mug should not have to hunt.  
**Love:** The homepage should end in an object, not only a sentence.  
**Outcome:** Home shows 2–4 available pieces with photo, name, price, and a Shop CTA. Portfolio stays the gallery; Shop is “you can take this home now.”

### B3. Make the shop tell the truth while it loads
**Need:** “Sold out” and “Price” with no euro amount looks like a broken store.  
**Love:** Scarcity feels special only when the available pieces look available.  
**Outcome:** No flash of sold-out on every item. Show a short loading state, then live price and stock. If the API is down, say so and point to email — do not fake emptiness. Align the three API items that *are* for sale with what the page shows.

### B4. A custom domain that matches the invoices
**Need:** Paying a stranger on github.io feels risky.  
**Love:** The brand already speaks as DKeramik; the URL should too.  
**Outcome:** Site lives at the domain named in terms (`dkeramik.lt` or similar). Open Graph image so a shared link looks like a studio, not a repo.

### B5. One product page, not two thinner cousins
**Need:** Shop pages currently omit dimensions, material, care, and gallery that portfolio already has.  
**Love:** The buying page should be the most complete page.  
**Outcome:** A shop item shows the full story + price + stock + add to cart. Portfolio items that are for sale link through to buy. Names visible without hover.

---

## Next — make it wanted

These turn a functioning shop into something people seek out.

### B6. Sold-out should start a relationship
**Need:** Handmade stock of 1 will always sell out. Losing that person is expensive.  
**Love:** “I’ll make another in this spirit” feels like being chosen, not rejected.  
**Outcome:** Sold-out pieces offer: notify me of the next firing / request a similar commission. Email captured. Admin sees demand per form (mug vs bowl vs vase).

### B7. A real commission path
**Need:** People already ask (copy says so): wedding sets, a bowl in a specific size, a gift with a name. Mailto is where intent dies.  
**Love:** A short brief: occasion, size, colours they like, deadline, budget band. Donata replies with yes/no/timeline. Deposit later if needed.  
**Outcome:** `/contact` (or a “Užsakyti individualiai” page) submits to the studio without requiring the visitor’s mail app. Custom work is marked as non-returnable, which the legal pages already allow.

### B8. Gifts as a first-class use
**Need:** Tea-cup pair and candle trio are already gifts; checkout treats everyone as buying for themselves.  
**Love:** A note in the box, optional wrapping, ship-to-someone-else, “this is for a housewarming.”  
**Outcome:** Gift option at checkout. A small “gifts” path on the shop: pair, set, under €50, pickup in Kaunas this week.

### B9. Show the maker, not only the manifesto
**Need:** Trust in a one-person studio is facial and spatial.  
**Love:** Seeing Donata, the wheel, the kiln, Kaunas light.  
**Outcome:** About uses real portraits and workshop photos. A short film or photo sequence of one piece from clay to glaze. Put **Kūryba** (`/craft`) in the footer or About — it is one of the strongest pages and currently hidden.

### B10. Packing, pickup, and “if it breaks”
**Need:** Ceramics shoppers fear the post. Legal returns text exists; the buying moment does not show it.  
**Love:** A photo of how a mug is wrapped. Pickup in Kaunas framed as meeting the studio, not as a logistics SKU.  
**Outcome:** Shop and checkout show: how it ships, pickup as an experience, 14-day rule in human language, breakage contact within 48 hours (already in returns — surface it).

### B11. Let people follow the studio where they already are
**Need:** Lithuanian makers are discovered on Instagram; the site has no door out or in.  
**Love:** Same visual world on IG and on the site; the site is where you actually buy.  
**Outcome:** Instagram (and maybe Facebook) in the footer. Later: “new firing” posts that link to the exact shop URL. Newsletter only after B6 exists — same list, calmer cadence.

---

## Later — make it a relationship

Build these after photos, a working shop, and a way back from sold-out.

### B12. Ritual collections, not only categories
**Need:** People do not shop “vases”; they shop “something for the windowsill” or “our dinner table.” Category keys already exist in copy but are unused.  
**Love:** “Rytui” (mug), “Stalui” (bowls, pair), “Šviesai” (candles), “Žaliai” (planter).  
**Outcome:** Shop and portfolio filter by use. A simple guide: “start with the cup you will hold every day.”

### B13. Sets that grow
**Need:** One mug creates the wish for a second, then a bowl. Today each SKU is an island.  
**Love:** “This glaze family” — add over months as firings allow.  
**Outcome:** Related pieces on a product page. A restockable core form (especially the morning mug) plus true one-offs. Nesting bowls and tea pairs sold as sets with a path to add later.

### B14. Open studio / pickup as a small event
**Need:** Kaunas pickup is free and unused as a brand moment.  
**Love:** Choosing a time, seeing the shelf, leaving with the piece wrapped in front of you.  
**Outcome:** After payment, propose pickup windows. Occasional open-studio hours listed on the site. No cash at pickup (already the legal stance) — keep it simple.

### B15. A first workshop
**Need:** Many people do not want another object; they want to *make* one. Highest emotional loyalty in ceramics.  
**Love:** A two-hour tasting of clay in Kaunas; they go home with a story and often become customers.  
**Outcome:** One repeating format (e.g. mug throwing or hand-building), date, price, small group, waitlist. Do not build a full course platform — a page + email + deposit is enough.

### B16. Seasonal firings
**Need:** A reason to return without fake discounts.  
**Love:** “Žiemos šviesa” candle drop; spring bud vases; Christmas gift window with a cutoff date.  
**Outcome:** A journal or shop chapter per season. Countdown only if stock is real. Journal dates should be current when you publish (the live entries still read as 2024).

### B17. Quiet proof from people who live with the work
**Need:** Strangers believe other homes more than a maker’s poem.  
**Love:** A photo of someone’s table, first name, city.  
**Outcome:** A handful of permissioned photos or short quotes. Never fake reviews. Instagram tags can seed this.

### B18. Baltic and diaspora shipping that is honest
**Need:** Checkout already says international is “email us.” Diaspora will try anyway.  
**Love:** A clear yes for LV/EE or a short list of countries, with a breakage-aware packing fee — or a firm “Lithuania only, gifts via a local friend.”  
**Outcome:** One written policy. Ambiguity feels like the shop is not ready.

---

## Ideas to pressure-test (do not start yet)

These could be loved later. They are the wrong next build.

- **Quiz / “find your piece” app.** Cute; photos and stock matter more.
- **AR “see it on your table.”** Expensive; a lifestyle photo does 80% of this.
- **Full CMS / headless catalog.** Adding a piece still needs photos and a story; admin inventory already exists. Revisit when firings are frequent.
- **Wholesale portal.** Cafés and small stays could be a later channel; it changes packing and volume. Earn the retail relationship first.
- **Loyalty points.** Wrong tone. A waitlist and a remembered glaze family are the loyalty program.
- **Chat widget.** Donata cannot staff a chat. Email or Instagram DMs are the human channel.
- **More journal volume for SEO.** Four strong essays exist. Publish when there is a firing or a thought — not to feed a calendar.

---

## Suggested sequence

```
Photos + honest shop + homepage objects
        → sold-out waitlist + commissions + gifts
                → maker presence + packing trust + Instagram
                        → rituals / sets / pickup / one workshop
                                → seasons and proof from real homes
```

The site already has a soul and a till. What people would need is a **piece they can see and actually buy**. What they would love is **Donata’s way of making a home** — in their hands, as a gift, or one morning in the studio.

When in doubt, spend the next week on a camera and three pieces in stock, not on a new page.
