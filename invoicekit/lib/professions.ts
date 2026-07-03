// Data source for the programmatic SEO pages (/invoice-template/[slug]).
// Each entry must read as a genuinely useful page for that trade, not a
// find-and-replace of the profession name — that's what earns rankings.

export interface Profession {
  slug: string;
  /** e.g. "Freelance Photographer" */
  name: string;
  /** lowercase, mid-sentence form, e.g. "freelance photographers" */
  plural: string;
  /** 2–3 sentence intro unique to the trade's billing reality. */
  intro: string;
  /** Line items pre-filled into the generator via ?preset=slug */
  sampleItems: { description: string; qty: number; rate: number }[];
  /** One concrete, trade-specific billing tip. */
  tip: string;
  /** Common payment terms for the trade, e.g. "50% deposit, balance on delivery" */
  terms: string;
}

export const PROFESSIONS: Profession[] = [
  {
    slug: "freelance-photographer",
    name: "Freelance Photographer",
    plural: "freelance photographers",
    intro:
      "Photography invoices usually combine a session or day rate with per-item charges for edited images, prints, and licensing. Spelling out usage rights on the invoice itself (personal use vs. commercial license) prevents the most common photography payment dispute.",
    sampleItems: [
      { description: "Portrait session (2 hours, on location)", qty: 1, rate: 350 },
      { description: "Edited high-resolution images", qty: 25, rate: 12 },
      { description: "Commercial usage license (12 months, web)", qty: 1, rate: 200 },
    ],
    tip: "List image licensing as its own line item. Clients who see 'license' priced separately rarely try to reuse photos beyond the agreed scope.",
    terms: "50% retainer to book the date, balance due on gallery delivery.",
  },
  {
    slug: "graphic-designer",
    name: "Graphic Designer",
    plural: "graphic designers",
    intro:
      "Design work is billed per project, per concept, or hourly — and revision rounds are where profit disappears. A good design invoice mirrors the proposal: base deliverable, included revisions, and extra rounds as separate billable lines.",
    sampleItems: [
      { description: "Logo design — 3 initial concepts", qty: 1, rate: 900 },
      { description: "Revision rounds beyond the 2 included", qty: 1, rate: 150 },
      { description: "Brand style sheet (colors, type, usage)", qty: 1, rate: 300 },
    ],
    tip: "Invoice extra revision rounds explicitly, even at a discount. It trains clients that feedback cycles have a cost.",
    terms: "50% upfront, 50% on delivery of final files.",
  },
  {
    slug: "web-developer",
    name: "Web Developer",
    plural: "web developers",
    intro:
      "Development invoices work best when they map to milestones the client can see working — a staging link is worth a thousand line items. Hosting, domains, and third-party licenses you purchased on the client's behalf belong on the invoice as pass-through costs.",
    sampleItems: [
      { description: "Website build — milestone 2 of 3 (CMS + templates)", qty: 1, rate: 2400 },
      { description: "Plugin licenses purchased on client's behalf", qty: 1, rate: 180 },
      { description: "Post-launch support retainer (monthly)", qty: 1, rate: 250 },
    ],
    tip: "Bill by milestone, not at the end. Three smaller invoices get paid faster and cap your exposure if a project stalls.",
    terms: "Per-milestone billing, net 14 days.",
  },
  {
    slug: "freelance-writer",
    name: "Freelance Writer",
    plural: "freelance writers",
    intro:
      "Writers bill per word, per article, or per project — and the invoice should say which, because editors process dozens of these a month and ambiguity causes delays. Rush fees and extra interview time are legitimate line items most writers forget to charge.",
    sampleItems: [
      { description: "Blog article, 1,500 words (SEO brief provided)", qty: 2, rate: 400 },
      { description: "Rush delivery (48-hour turnaround)", qty: 1, rate: 150 },
      { description: "Source interviews beyond scope", qty: 1, rate: 100 },
    ],
    tip: "Put the word count and agreed per-word or per-piece rate on the invoice. Accounts payable approves faster when the math is visible.",
    terms: "Net 15 from invoice date; late fee of 1.5%/month thereafter.",
  },
  {
    slug: "plumber",
    name: "Plumber",
    plural: "plumbers",
    intro:
      "Plumbing invoices separate labor from parts, and customers expect to see both. Itemizing the service call fee, hourly labor, and each part with its markup builds the trust that gets you referrals — and protects you when a customer questions the total.",
    sampleItems: [
      { description: "Service call / diagnostic fee", qty: 1, rate: 89 },
      { description: "Labor — water heater replacement", qty: 3, rate: 110 },
      { description: "40-gal water heater unit + fittings", qty: 1, rate: 620 },
    ],
    tip: "Photograph the completed work and reference it on the invoice ('photos available on request'). Disputes drop sharply when customers know documentation exists.",
    terms: "Due on completion; card, check, or bank transfer accepted.",
  },
  {
    slug: "electrician",
    name: "Electrician",
    plural: "electricians",
    intro:
      "Electrical work is quoted by the job but invoiced with enough detail to satisfy both the customer and, when applicable, the permit file. Listing panel work, circuits, and fixtures as separate lines makes the invoice double as a record of what was actually installed.",
    sampleItems: [
      { description: "Panel upgrade to 200A service", qty: 1, rate: 1800 },
      { description: "New 20A circuits — kitchen remodel", qty: 4, rate: 220 },
      { description: "Permit fee (pass-through)", qty: 1, rate: 175 },
    ],
    tip: "Show permit fees as pass-through lines with no markup. It signals you pulled the permit — a differentiator customers pay for.",
    terms: "50% on scheduling, balance on inspection sign-off.",
  },
  {
    slug: "handyman",
    name: "Handyman",
    plural: "handyman services",
    intro:
      "Handyman jobs bundle many small tasks, so the invoice is the difference between 'you were here four hours' and a list of nine completed items the customer can show their spouse. Itemize every task, however small — the perceived value of the visit rises with each line.",
    sampleItems: [
      { description: "Mount 2 TVs incl. concealed cabling", qty: 1, rate: 180 },
      { description: "Repair drywall + paint touch-up, hallway", qty: 1, rate: 140 },
      { description: "Replace bathroom faucet (parts separate)", qty: 1, rate: 95 },
    ],
    tip: "Never invoice 'labor — 4 hours' alone. List each completed task; the same total reads as a bargain instead of a bill.",
    terms: "Due on completion.",
  },
  {
    slug: "house-cleaner",
    name: "House Cleaning Service",
    plural: "house cleaners",
    intro:
      "Cleaning invoices are simple, but recurring clients deserve invoices that reflect it: the visit date, the service level (standard, deep, move-out), and any add-ons like ovens or windows. Consistent invoices make it easy to raise rates cleanly once a year.",
    sampleItems: [
      { description: "Standard clean — 3 bed / 2 bath", qty: 1, rate: 160 },
      { description: "Add-on: inside oven + fridge", qty: 1, rate: 45 },
      { description: "Add-on: interior windows", qty: 1, rate: 35 },
    ],
    tip: "Name the service tier on every invoice. When a 'standard clean' client asks for move-out depth, the upsell conversation is already half done.",
    terms: "Due on day of service; recurring clients billed monthly.",
  },
  {
    slug: "personal-trainer",
    name: "Personal Trainer",
    plural: "personal trainers",
    intro:
      "Trainers sell packages, and the invoice should reinforce the package math: sessions used, sessions remaining, and the per-session value. Invoicing packages upfront rather than per session stabilizes your income and slashes no-shows.",
    sampleItems: [
      { description: "10-session training package (60 min)", qty: 1, rate: 650 },
      { description: "Nutrition plan + monthly check-in", qty: 1, rate: 120 },
      { description: "No-show fee per cancellation policy", qty: 1, rate: 40 },
    ],
    tip: "Note 'sessions remaining' on each package invoice. It doubles as a renewal reminder right when the client is looking at money anyway.",
    terms: "Packages prepaid; renewals due before first session of new block.",
  },
  {
    slug: "makeup-artist",
    name: "Makeup Artist",
    plural: "makeup artists",
    intro:
      "Bridal and event makeup runs on deposits, trials, and day-of schedules with multiple faces. The invoice should list the trial, each person serviced, travel, and early-start fees separately — the categories clients already expect from wedding vendors.",
    sampleItems: [
      { description: "Bridal makeup — trial session", qty: 1, rate: 120 },
      { description: "Bridal makeup — wedding day", qty: 1, rate: 250 },
      { description: "Bridal party makeup (per person)", qty: 4, rate: 95 },
    ],
    tip: "Charge the trial as its own line, never 'free with booking'. Free trials attract shoppers; priced trials attract bookings.",
    terms: "Non-refundable deposit to hold the date; balance due 7 days before the event.",
  },
  {
    slug: "wedding-planner",
    name: "Wedding Planner",
    plural: "wedding planners",
    intro:
      "Planner invoices track a long engagement: a booking retainer, milestone payments, and a stream of vendor pass-throughs. Keeping your fee lines and pass-through lines visually separate on the invoice keeps couples from conflating your fee with the florist's.",
    sampleItems: [
      { description: "Full planning package — payment 2 of 3", qty: 1, rate: 1800 },
      { description: "Vendor deposits paid on couple's behalf", qty: 1, rate: 950 },
      { description: "Additional venue walkthrough", qty: 1, rate: 150 },
    ],
    tip: "Group vendor pass-throughs under a labeled section with receipts attached. Transparency here is your referral engine.",
    terms: "Retainer + two milestone payments; final balance 14 days before the wedding.",
  },
  {
    slug: "dj",
    name: "DJ",
    plural: "DJs",
    intro:
      "Event DJ invoices cover the performance block plus everything around it: setup, overtime, equipment add-ons like uplighting, and travel. Overtime priced on the invoice — before the event — is the difference between an awkward 11 p.m. negotiation and an easy extra hour.",
    sampleItems: [
      { description: "Wedding reception DJ set (5 hours)", qty: 1, rate: 1100 },
      { description: "Uplighting package (12 fixtures)", qty: 1, rate: 300 },
      { description: "Overtime rate per additional hour", qty: 1, rate: 200 },
    ],
    tip: "Print the overtime rate on every event invoice even when unused. When the party runs long, the price is already agreed.",
    terms: "Deposit to secure the date; balance due on or before event day.",
  },
  {
    slug: "landscaper",
    name: "Landscaper",
    plural: "landscapers",
    intro:
      "Landscaping mixes one-time projects with recurring maintenance, and the invoice format should differ: projects itemize materials and labor phases, while maintenance invoices state the service period plainly. Materials markup is standard — but only survives scrutiny when materials are itemized.",
    sampleItems: [
      { description: "Monthly maintenance — mow, edge, blow (4 visits)", qty: 1, rate: 240 },
      { description: "Mulch installation — 5 yds incl. material", qty: 1, rate: 425 },
      { description: "Irrigation head replacement", qty: 3, rate: 28 },
    ],
    tip: "State the service period ('Maintenance: June 1–30') on recurring invoices. It kills the 'what was this for?' email.",
    terms: "Maintenance billed monthly in advance; projects 50% up front.",
  },
  {
    slug: "painter",
    name: "Painting Contractor",
    plural: "painters",
    intro:
      "Painting bids win on price but invoices win on detail: rooms or surfaces, prep work, coats, and the exact product used. Naming the paint line ('two coats, premium interior latex') justifies your price against the lowball competitor who plans one coat of builder grade.",
    sampleItems: [
      { description: "Interior painting — living room + hallway, 2 coats", qty: 1, rate: 950 },
      { description: "Drywall prep: patch, sand, prime", qty: 1, rate: 220 },
      { description: "Premium interior latex (client-selected color)", qty: 4, rate: 52 },
    ],
    tip: "Note the paint brand, line, and coat count on the invoice. It documents quality and pre-sells the next room.",
    terms: "Materials deposit up front; balance on final walkthrough.",
  },
  {
    slug: "auto-mechanic",
    name: "Auto Mechanic",
    plural: "mobile mechanics and independent shops",
    intro:
      "Auto repair invoices are trust documents: parts with part numbers, labor hours against a stated rate, and shop supplies as a visible line rather than a mystery percentage. Many states require written estimates — the invoice should match the estimate or explain the difference.",
    sampleItems: [
      { description: "Front brake pads + rotors (parts, incl. part #)", qty: 1, rate: 310 },
      { description: "Labor — brake service (2.0 hrs @ $95)", qty: 2, rate: 95 },
      { description: "Shop supplies & disposal", qty: 1, rate: 18 },
    ],
    tip: "Reference the estimate number on the invoice and flag any variance with one line of explanation. It preempts the dispute before it forms.",
    terms: "Due on vehicle pickup.",
  },
  {
    slug: "tutor",
    name: "Private Tutor",
    plural: "tutors",
    intro:
      "Tutoring invoices go to parents who are juggling several activity payments a month, so clarity wins: student name, subject, session dates, and rate per session. Monthly consolidated invoices get paid more reliably than per-session requests.",
    sampleItems: [
      { description: "Math tutoring — 60 min sessions (June)", qty: 6, rate: 55 },
      { description: "Exam prep intensive — 90 min", qty: 2, rate: 80 },
      { description: "Late cancellation (per policy)", qty: 1, rate: 27.5 },
    ],
    tip: "List each session date on the monthly invoice. Parents cross-check calendars, and matching dates means instant payment.",
    terms: "Billed monthly; due within 7 days.",
  },
  {
    slug: "music-teacher",
    name: "Music Teacher",
    plural: "music teachers",
    intro:
      "Independent music teachers do best invoicing by the term or month rather than the lesson — it frames lessons as enrollment, not appointments, and stabilizes income across holidays. Books and exam fees purchased for students belong on the invoice at cost.",
    sampleItems: [
      { description: "Piano lessons — 30 min weekly (monthly rate)", qty: 1, rate: 180 },
      { description: "Method book (purchased for student)", qty: 1, rate: 14 },
      { description: "Recital participation fee", qty: 1, rate: 25 },
    ],
    tip: "Invoice monthly enrollment, not individual lessons. Missed-lesson disputes disappear when families buy the month.",
    terms: "Due by the 1st of each month.",
  },
  {
    slug: "virtual-assistant",
    name: "Virtual Assistant",
    plural: "virtual assistants",
    intro:
      "VA work spans dozens of small tasks, so invoices need a summary layer: hours by category (inbox, scheduling, research) rather than a 40-row task log. Attach the detailed log separately — the invoice sells the value, the log proves it.",
    sampleItems: [
      { description: "Retainer — 20 hrs/month admin support", qty: 1, rate: 700 },
      { description: "Hours beyond retainer (client approved)", qty: 4, rate: 40 },
      { description: "Project: CRM data cleanup", qty: 1, rate: 250 },
    ],
    tip: "Sell retainers with a visible overage rate. The retainer anchors your income; the overage line grows it without renegotiation.",
    terms: "Retainer due 1st of month; overages billed month-end, net 7.",
  },
  {
    slug: "social-media-manager",
    name: "Social Media Manager",
    plural: "social media managers",
    intro:
      "Social media management is retainer work, and the invoice should restate what the retainer buys: platforms, post volume, community management hours. Ad spend managed on the client's card should never touch your invoice; ad spend you front must appear as a pass-through with reports attached.",
    sampleItems: [
      { description: "Monthly management — 2 platforms, 12 posts", qty: 1, rate: 850 },
      { description: "Short-form video editing (per reel)", qty: 4, rate: 75 },
      { description: "Ad spend managed (pass-through)", qty: 1, rate: 300 },
    ],
    tip: "Restate deliverable counts on every invoice. When renewal talks come, twelve months of documented delivery is your case.",
    terms: "Retainer billed monthly in advance.",
  },
  {
    slug: "consultant",
    name: "Independent Consultant",
    plural: "independent consultants",
    intro:
      "Consulting invoices go through accounts payable departments with rules: PO numbers, payment terms, and line descriptions that match the statement of work. The fastest-paid consulting invoices quote the SOW section they bill against, line by line.",
    sampleItems: [
      { description: "Advisory retainer — July (per SOW §2.1)", qty: 1, rate: 3500 },
      { description: "Workshop facilitation — full day on-site", qty: 1, rate: 2000 },
      { description: "Travel (per diem + mileage, per SOW §4)", qty: 1, rate: 340 },
    ],
    tip: "Ask for the PO number before work starts and print it on the invoice. Missing POs are the #1 cause of 60-day consulting payment delays.",
    terms: "Net 30 with 1.5%/month late interest, per master agreement.",
  },
  {
    slug: "bookkeeper",
    name: "Bookkeeper",
    plural: "bookkeepers",
    intro:
      "A bookkeeper's own invoice is a sales document — clients judge your work by it. Flat monthly packages tiered by transaction volume invoice cleaner than hourly billing, and year-end or cleanup projects deserve their own clearly-scoped lines.",
    sampleItems: [
      { description: "Monthly bookkeeping — up to 150 transactions", qty: 1, rate: 400 },
      { description: "Historical cleanup — Q1 (one-time)", qty: 1, rate: 600 },
      { description: "1099 preparation & filing", qty: 5, rate: 15 },
    ],
    tip: "Your invoice is your portfolio. If it's late, vague, or inconsistent, clients quietly question the books you keep for them.",
    terms: "Monthly service billed on the 1st; auto-pay encouraged.",
  },
  {
    slug: "videographer",
    name: "Videographer",
    plural: "videographers",
    intro:
      "Video projects sprawl — shoot days, editing hours, licensing, revisions — so the invoice must mirror the quote's structure exactly. Raw footage ownership and usage terms belong in writing; a line on the invoice referencing the license keeps deliverables and rights tied together.",
    sampleItems: [
      { description: "Brand video — full-day shoot (crew of 2)", qty: 1, rate: 1600 },
      { description: "Editing & color (up to 2 revision rounds)", qty: 1, rate: 900 },
      { description: "Licensed music track (pass-through)", qty: 1, rate: 89 },
    ],
    tip: "Bill 50% before the shoot day, not after. Once footage exists only you can edit, incentives get weird — the deposit keeps everyone aligned.",
    terms: "50% to book the shoot; balance before final file delivery.",
  },
  {
    slug: "interior-designer",
    name: "Interior Designer",
    plural: "interior designers",
    intro:
      "Design fees, furnishings procurement, and trade discounts make interior design invoices uniquely layered. Whether you pass trade discounts through or keep the margin, the invoice policy must match the letter of agreement — surprises here end client relationships.",
    sampleItems: [
      { description: "Design fee — living room concept + boards", qty: 1, rate: 1500 },
      { description: "Procurement: sofa (trade order)", qty: 1, rate: 2200 },
      { description: "Installation & styling day", qty: 1, rate: 450 },
    ],
    tip: "Invoice procurement items as they're ordered, not at project end. Furniture lead times mean end-loaded invoices arrive months after enthusiasm peaked.",
    terms: "Design fee up front; procurement invoiced at order time.",
  },
  {
    slug: "massage-therapist",
    name: "Massage Therapist",
    plural: "massage therapists",
    intro:
      "Solo massage therapists invoice for packages, corporate chair-massage events, and clients submitting to HSA/FSA or insurance. Those receipts need your credentials, license number, and session codes — a generic receipt gets rejected and the client asks you to redo it.",
    sampleItems: [
      { description: "Therapeutic massage — 60 min", qty: 1, rate: 95 },
      { description: "5-session package (prepaid)", qty: 1, rate: 425 },
      { description: "Corporate chair massage event — 3 hrs", qty: 1, rate: 360 },
    ],
    tip: "Include your license number and modality on every invoice. HSA/FSA administrators reject receipts without them, and redone paperwork is unpaid work.",
    terms: "Due at time of service; packages prepaid.",
  },
  {
    slug: "dog-groomer",
    name: "Dog Groomer",
    plural: "dog groomers",
    intro:
      "Grooming invoices are per-pet and per-condition: breed and size set the base, while dematting, special handling, and flea treatments are add-ons the owner should see itemized. Itemizing add-ons also documents the dog's condition at drop-off — useful more often than you'd hope.",
    sampleItems: [
      { description: "Full groom — golden retriever (bath, cut, nails)", qty: 1, rate: 95 },
      { description: "Dematting (30 min)", qty: 1, rate: 30 },
      { description: "Teeth brushing add-on", qty: 1, rate: 12 },
    ],
    tip: "Itemize condition-based add-ons like dematting every time. It justifies the price and creates a paper trail of the coat's state.",
    terms: "Due at pickup.",
  },
  {
    slug: "caterer",
    name: "Caterer",
    plural: "caterers",
    intro:
      "Catering invoices price per head, then layer staffing, rentals, delivery, and service charges — and clients scrutinize every layer. A per-head line with the final guaranteed count, dated, protects you when the headcount conversation gets fuzzy after the event.",
    sampleItems: [
      { description: "Buffet dinner — per guest (final count 60)", qty: 60, rate: 38 },
      { description: "Service staff (3 × 5 hrs)", qty: 15, rate: 35 },
      { description: "Delivery, setup & breakdown", qty: 1, rate: 250 },
    ],
    tip: "Print the guarantee date and final guest count on the invoice. 'We ended up with fewer people' is not a discount once the guarantee passed.",
    terms: "Deposit on booking; final count 7 days out; balance due day of event.",
  },
  {
    slug: "hvac-technician",
    name: "HVAC Technician",
    plural: "HVAC techs",
    intro:
      "HVAC invoices span diagnostic calls, repairs, seasonal maintenance plans, and full installs — each with different formats. Repair invoices need refrigerant quantities and part numbers; install invoices should list equipment model and serial numbers, which double as the customer's warranty record.",
    sampleItems: [
      { description: "Diagnostic service call", qty: 1, rate: 95 },
      { description: "Capacitor replacement (part + labor)", qty: 1, rate: 210 },
      { description: "Refrigerant recharge — R-410A (per lb)", qty: 2, rate: 90 },
    ],
    tip: "Record equipment model and serial numbers on install invoices. You become the keeper of the warranty record — and the obvious choice for every future service call.",
    terms: "Due on completion; maintenance plans billed annually.",
  },
  {
    slug: "roofer",
    name: "Roofing Contractor",
    plural: "roofers",
    intro:
      "Roofing invoices are often headed to an insurance claim, which means they must match the adjuster's scope: squares of material, tear-off, underlayment, flashing, and disposal as separate lines. Even retail jobs benefit from that structure — it reads as professional and survives any dispute.",
    sampleItems: [
      { description: "Tear-off & disposal — 24 squares", qty: 24, rate: 55 },
      { description: "Architectural shingle installation", qty: 24, rate: 210 },
      { description: "Flashing & drip edge replacement", qty: 1, rate: 480 },
    ],
    tip: "Mirror insurance-scope language (squares, tear-off, underlayment) even on retail invoices. Adjusters, lenders, and future buyers all read roofs in that dialect.",
    terms: "Materials deposit; balance on completion or per insurance draw schedule.",
  },
  {
    slug: "mobile-car-detailer",
    name: "Mobile Car Detailer",
    plural: "mobile detailers",
    intro:
      "Detailing invoices sell packages with visible add-ons: the base detail, then extraction, pet hair, headlight restoration, ceramic coating. Itemized add-ons teach customers your menu — this invoice is also next visit's price list.",
    sampleItems: [
      { description: "Full interior + exterior detail — SUV", qty: 1, rate: 220 },
      { description: "Pet hair removal", qty: 1, rate: 40 },
      { description: "Headlight restoration (pair)", qty: 1, rate: 60 },
    ],
    tip: "Treat every invoice as a menu: list add-ons performed and, at the bottom, one you'd recommend next time with its price.",
    terms: "Due on completion; fleet accounts net 15.",
  },
  {
    slug: "notary",
    name: "Mobile Notary",
    plural: "mobile notaries",
    intro:
      "Mobile notary and loan-signing invoices must respect state fee caps: the notarial acts themselves are capped per signature, while travel, printing, and after-hours convenience fees are separate uncapped services. The invoice must show that split or risk compliance questions.",
    sampleItems: [
      { description: "Notarial acts (per signature, state max)", qty: 4, rate: 15 },
      { description: "Travel fee — within 20 miles", qty: 1, rate: 35 },
      { description: "Loan signing package (printing + 2 hrs)", qty: 1, rate: 150 },
    ],
    tip: "Always separate capped notarial fees from travel and convenience fees. Commingling them on one line is the classic audit red flag.",
    terms: "Due at signing; title companies net 30.",
  },
];

export function getProfession(slug: string): Profession | undefined {
  return PROFESSIONS.find((p) => p.slug === slug);
}
