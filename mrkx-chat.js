(function(){
/* Language picker: shown once on the home page for first-time direct visitors.
   - Only on "/" and "/is" (home), never on deep pages.
   - Not shown to visitors who arrive from a search engine (they already landed on the right language)
     and not to known crawlers, so it can never act as an intrusive interstitial.
   - Dismissible (button, backdrop, Esc); the choice is remembered in localStorage. */
(function () {
  var cfg = window.MRKX_CHAT_CONFIG || {};
  var KEY = "mrkx_lang_choice";
  var path = cfg.lpPath || location.pathname;
  var ref = cfg.lpRef != null ? cfg.lpRef : (document.referrer || "");
  var isHome = /^\/(is)?\/?$/.test(path);
  var onIS = /^\/is(\/|$)/.test(path);
  if (!isHome || cfg.noLangPicker) return;
  if (/bot|crawl|spider|lighthouse|pagespeed/i.test(navigator.userAgent || "")) return;
  if (/(^|\.)(google|bing|duckduckgo|yahoo|yandex|ecosia|baidu)\./i.test(ref.replace(/^https?:\/\//, "").split("/")[0])) return;
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  var pref = /^is\b/i.test(navigator.language || "") ? "is" : "en";

  function altHref(lang) {
    var want = lang === "is" ? /^is/i : /^en/i, links = document.querySelectorAll('link[rel="alternate"][hreflang]');
    for (var i = 0; i < links.length; i++) if (want.test(links[i].getAttribute("hreflang"))) return links[i].getAttribute("href");
    return lang === "is" ? "/is" : "/";
  }
  function remember(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }

  function show() {
    var host = document.createElement("div");
    host.setAttribute("data-mrkx-langpick", "");
    host.style.cssText = "position:fixed;inset:0;z-index:2147483646";
    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    root.innerHTML =
      '<style>' +
      '*{box-sizing:border-box}' +
      '.bd{position:fixed;inset:0;background:rgba(8,12,24,.38);backdrop-filter:blur(10px) saturate(1.1);-webkit-backdrop-filter:blur(10px) saturate(1.1);display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));font-family:Helvetica,Arial,sans-serif;opacity:0;transition:opacity .3s}' +
      '.bd.in{opacity:1}' +
      /* clear, colourless, milky "opal" glass: translucent white fill, strong blur, bright edge, soft inner highlight */
      '.card{position:relative;width:100%;max-width:380px;padding:30px 24px 24px;border-radius:26px;text-align:center;color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.28);' +
      'background:linear-gradient(135deg,rgba(255,255,255,.26) 0%,rgba(255,255,255,.10) 42%,rgba(255,255,255,.16) 100%);' +
      'backdrop-filter:blur(28px) saturate(1.5) brightness(1.08);-webkit-backdrop-filter:blur(28px) saturate(1.5) brightness(1.08);' +
      'border:1px solid rgba(255,255,255,.42);' +
      'box-shadow:0 24px 70px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.65),inset 0 -1px 0 rgba(255,255,255,.12),inset 0 0 40px rgba(255,255,255,.07);overflow:hidden}' +
      '.card:before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(120% 70% at 18% -10%,rgba(255,255,255,.38),rgba(255,255,255,0) 55%),radial-gradient(90% 60% at 100% 110%,rgba(255,255,255,.14),rgba(255,255,255,0) 60%)}' +
      '.card>*{position:relative}' +
      'h2{margin:0 0 4px;font-size:21px;font-weight:600;letter-spacing:.2px}' +
      'p{margin:0 0 22px;font-size:14px;color:rgba(255,255,255,.82)}' +
      '.row{display:flex;gap:12px}' +
      'a.b{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:64px;padding:12px;border-radius:16px;color:#fff;text-decoration:none;font-size:17px;font-weight:600;cursor:pointer;' +
      'background:linear-gradient(160deg,rgba(255,255,255,.28),rgba(255,255,255,.10));border:1px solid rgba(255,255,255,.4);' +
      'box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 6px 18px rgba(0,0,0,.14);transition:background .18s,border-color .18s,transform .18s}' +
      'a.b small{font-size:11px;font-weight:400;color:rgba(255,255,255,.78);letter-spacing:.8px}' +
      'a.b:hover,a.b:focus-visible{background:linear-gradient(160deg,rgba(255,255,255,.42),rgba(255,255,255,.18));border-color:rgba(255,255,255,.75);outline:none;transform:translateY(-1px)}' +
      'a.b:focus-visible{box-shadow:0 0 0 3px rgba(255,255,255,.55),inset 0 1px 0 rgba(255,255,255,.55)}' +
      'a.b.pref{border-color:rgba(255,255,255,.7);background:linear-gradient(160deg,rgba(255,255,255,.40),rgba(255,255,255,.16))}' +
      '.x{position:absolute;top:8px;right:8px;width:36px;height:36px;border:0;border-radius:50%;background:transparent;color:rgba(255,255,255,.85);font-size:22px;line-height:1;cursor:pointer;z-index:2}' +
      '.x:hover,.x:focus-visible{background:rgba(255,255,255,.22);color:#fff;outline:none}' +
      '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.card{background:rgba(70,78,100,.88)}}' +
      '@media (max-width:360px){.row{flex-direction:column}}' +
      '@media (prefers-reduced-motion:reduce){.bd,a.b{transition:none}}' +
      '</style>' +
      '<div class="bd" role="dialog" aria-modal="true" aria-labelledby="t">' +
      '<div class="card"><button class="x" type="button" aria-label="Close / Loka">&times;</button>' +
      '<h2 id="t">Choose your language</h2><p>Veldu tungum&aacute;l</p>' +
      '<div class="row">' +
      '<a class="b' + (pref === "en" ? " pref" : "") + '" data-l="en" href="' + altHref("en") + '" lang="en">English<small>EN</small></a>' +
      '<a class="b' + (pref === "is" ? " pref" : "") + '" data-l="is" href="' + altHref("is") + '" lang="is">&Iacute;slenska<small>IS</small></a>' +
      '</div></div></div>';
    var prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(host);
    var bd = root.querySelector(".bd");
    requestAnimationFrame(function () { bd.classList.add("in"); });
    var first = root.querySelector("a.b.pref") || root.querySelector("a.b");
    try { first.focus(); } catch (e) {}
    function close(choice) {
      if (choice) remember(choice); else remember(onIS ? "is" : "en");
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey, true);
      if (host.parentNode) host.parentNode.removeChild(host);
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab") {
        var els = [].slice.call(root.querySelectorAll("a.b,.x")), cur = root.activeElement, i = els.indexOf(cur);
        e.preventDefault();
        els[(i + (e.shiftKey ? els.length - 1 : 1)) % els.length].focus();
      }
    }
    document.addEventListener("keydown", onKey, true);
    root.querySelector(".x").addEventListener("click", function () { close(); });
    bd.addEventListener("click", function (e) { if (e.target === bd) close(); });
    [].forEach.call(root.querySelectorAll("a.b"), function (a) {
      a.addEventListener("click", function (e) {
        var l = a.getAttribute("data-l"); remember(l);
        if ((l === "is") === onIS) { e.preventDefault(); close(l); }   // already on this language: just continue
      });
    });
  }
  function go() { setTimeout(show, cfg.lpDelay != null ? cfg.lpDelay : 300); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();

/* MRKX Assistant knowledge base (English answers, studio voice "we").
   Facts only from mrkxlabs.com. Prices: starting prices only (Oct 2026 list: website 450k, search foundation 220k, app 1.2M ISK, plus VAT). */
var MRKX_KB = (function () {
  var P_WEB = "450,000 ISK";
  var P_SEO = "220,000 ISK";
  var P_APP = "1,200,000 ISK";

  var links = {
    home: "/", services: "/services", website: "/services/websites", seo: "/services/seo",
    landing: "/services/landing-page", brand: "/services/brand-system", automation: "/services/automation-systems", app: "/services/mobile-app-design-development",
    about: "/about", contact: "/contact", faq: "/faq", portfolio: "/portfolio"
  };

  /* kind: "topic" (service), "question" (question type, outranks topic on ties), "faq", "rule" */
  var intents = [
    { id: "greet", noCount: true, kind: "question", kw: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon", "hallo", "halo"],
      a: ["Hi, good to have you here. What are you working on?",
          "Hello! Tell me a bit about what you need and I'll point you in the right direction."],
      chips: [{ t: "What do you offer?", go: "services" }, { t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "thanks", kind: "question", kw: ["thanks", "thank you", "thx", "cheers", "appreciate"],
      a: ["You're welcome. Anything else I can help with?", "Happy to help. Is there anything else you'd like to know?"],
      chips: [{ t: "Free analysis", go: "free_analysis" }, { t: "Talk to the team", go: "human" }], noCount: true },

    { id: "bye", kind: "question", kw: ["bye", "goodbye", "see you", "that is all", "that's all", "nothing else"],
      a: ["Thanks for stopping by. If you want to continue later, you'll find us at hello@mrkxlabs.com."], noCount: true },

    { id: "about_bot", kind: "question", kw: ["are you a bot", "are you human", "are you real", "are you a person", "who are you", "what are you", "are you ai", "robot"],
      a: ["I'm MRKX Assistant, an automated assistant for MRKX Labs, not a person. I can explain our services and answer common questions, and if I can't help, I'll pass your question to our team."],
      chips: [{ t: "Talk to the team", go: "human" }, { t: "What do you offer?", go: "services" }] },

    { id: "about", kind: "question", kw: ["real company", "are you real", "legit", "legitimate", "can i trust you", "how long have you been", "who runs", "founder", "who owns mrkx", "about you", "about mrkx", "who is mrkx", "what is mrkx", "tell me about your company", "who are mrkx labs", "your company", "your background", "your experience", "who is behind", "your studio", "your team", "your approach"],
      a: ["MRKX Labs is a digital systems studio based in Höfn, Iceland. We combine strategy, sales thinking, marketing structure, design, web development, SEO and analytics, so a website isn't just a nice surface but a path from attention to trust to enquiry. Our principles are clarity, credibility and action. [About us](/about)"],
      more: "We define the offer, audience, positioning and message flow before we build anything visual. That's why we treat every website, landing page or brand system as part of a bigger growth system rather than a standalone design.",
      chips: [{ t: "What do you offer?", go: "services" }, { t: "How do you work?", go: "process" }, { t: "Examples of your work", go: "portfolio" }] },

    { id: "services", kind: "question", kw: ["what do you offer", "what do you do", "your services", "services", "what can you do", "what do you build", "offer", "capabilities", "svara a ensku"],
      a: ["We offer six things: landing pages, business websites, SEO strategy, brand systems, automation and mobile apps. They work on their own, but they're strongest as one connected system. Which one is closest to what you need? [All services](/services)"],
      chips: [{ t: "Website", go: "svc_website" }, { t: "SEO", go: "svc_seo" }, { t: "Landing page", go: "svc_landing" }, { t: "Brand", go: "svc_brand" }, { t: "Automation", go: "svc_automation" }, { t: "Mobile app", go: "svc_app" }] },

    { id: "svc_website", kind: "topic", topic: "website", kw: ["website", "web site", "web design", "web development", "business website", "company website", "build a site", "new site", "webpage", "homepage", "site design", "redesign"],
      a: ["Our website work covers structure, design, development and the technical SEO foundations: page hierarchy, responsive build, performance, accessibility basics, analytics and integrations. Business Website projects start from " + P_WEB + " plus VAT. [Website service](/services/websites)"],
      more: "We plan the information architecture before the visual design: page hierarchy, navigation, URL structure, service-page planning and internal linking. The build covers a responsive front end tested across devices and browsers, a content structure that is easy to edit without breaking the design, technical SEO foundations (metadata, headings, sitemap, structured data), performance and layout stability, accessibility basics, safe form handling, GA4 and Search Console setup, and integrations such as CRM, email, booking or payments. We also plan for growth with reusable templates and multilingual readiness, and check forms, indexing, analytics events and links after launch. [Website service](/services/websites)",
      chips: [{ t: "More detail", go: "sec:website" }, { t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }, { t: "How do you work?", go: "process" }] },

    { id: "svc_seo", kind: "topic", topic: "seo", kw: ["seo", "search engine", "google ranking", "rank on google", "found on google", "search visibility", "search foundation", "organic traffic", "keywords"],
      a: ["Our SEO strategy work covers page structure, relevant content, technical foundations, metadata, internal linking and local search readiness. Our Search Foundation work starts from " + P_SEO + " plus VAT. [SEO service](/services/seo)"],
      more: "We treat SEO as part of your site's architecture, not a checklist. It starts with the technical foundation (crawling, indexing, sitemap, canonicals, redirects, structured data, speed), then search intent and page architecture, so each important service has a page with a clear purpose. We add content clarity, metadata, local SEO for Icelandic businesses (website, Google Business Profile, consistent details) and measurement through Search Console and analytics. We also keep the site clear for AI search, without shortcuts. We don't promise rankings, because search engines decide those. [SEO service](/services/seo)",
      chips: [{ t: "More detail", go: "sec:seo" }, { t: "Pricing", go: "pricing" }, { t: "How long does SEO take?", go: "seo_time" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "svc_landing", kind: "topic", topic: "landing", kw: ["landing page", "landing pages", "campaign page", "ad page", "conversion page", "lead page", "funnel"],
      a: ["A landing page is a focused page for one campaign, audience or offer, built to turn interest into enquiries. Copy, structure and tracking are planned together instead of adding text after the design. Landing pages are priced per project, so it's best to talk it through in a short consultation. [Services](/services)"],
      more: "We start from the decision the visitor has to make, not from a template. That means clarifying the audience and campaign, the offer, the message and the proof, then the design, the form and the tracking. A typical project can include strategy, conversion copy, wireframes and custom design, responsive development, form and email setup, CRM or booking connections, analytics and testing before launch. We don't claim a universal best headline or layout. We look for the real bottleneck first. [Landing page service](/services/landing-page)",
      chips: [{ t: "More detail", go: "sec:landing" }, { t: "Landing page vs website", go: "landing_vs_site" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "svc_brand", kind: "topic", topic: "brand", kw: ["brand", "branding", "brand system", "logo", "visual identity", "brand identity", "brand design"],
      a: ["A brand system is more than a logo. It defines how your identity works across visuals, messaging, your website and future assets, so everything feels consistent and trustworthy. It's priced per project. [Services](/services)"],
      more: "A brand system can include positioning, logo usage rules, colour and typography systems, spacing and layout principles, image and icon direction, tone of voice, and rules for your website, landing pages and social media. We also cover the technical layer: accessible colour combinations, responsive type, export-ready assets, a Figma-ready structure and usage documentation, so the system actually works after handoff. The exact scope depends on your business and what needs to be supported. [Brand system service](/services/brand-system)",
      chips: [{ t: "More detail", go: "sec:brand" }, { t: "Brand system vs logo", go: "brand_vs_logo" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "svc_automation", kind: "topic", topic: "automation", kw: ["automation", "automate", "automations", "workflow", "crm", "zapier", "n8n", "make.com", "business automation"],
      a: ["We build automation for repetitive, rule-based work such as lead handling, CRM updates, follow-up emails, reporting, notifications and booking flows. Work that needs human judgment is supported rather than replaced. It's priced per project. [Services](/services)"],
      more: "We start from the workflow, not from a tool: where information enters, where it needs to go and who approves what. Typical areas are lead handling and CRM updates, website form workflows, client onboarding, follow-up emails, internal tasks and notifications, bookings, reporting and document handling. A reliable system also has validation, duplicate handling, retries, error alerts, logs and clear ownership, so a failure never goes unnoticed. AI is used only where interpretation adds value, with a human approving the risky steps. [Automation service](/services/automation-systems)",
      chips: [{ t: "More detail", go: "sec:automation" }, { t: "What can be automated?", go: "automation_what" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "svc_app", kind: "topic", topic: "app", kw: ["mobile app", "mobile apps", "app", "apps", "app development", "ios app", "android app", "build an app", "build apps", "an app", "application", "app store", "google play", "native app", "smartphone app", "mobile application"],
      a: ["We design and develop mobile apps, but we first check whether an app is the right solution at all. It makes sense when users need repeat access, accounts, offline use or push notifications. App projects start from " + P_APP + " plus VAT, and the final price depends on scope. [Services](/services)"],
      more: "We start with the product decision: who the app is for, the one core action the first version must prove, and whether an app is the right format at all. Then we plan the structure behind the screens: accounts, data, APIs, permissions, error and loading states, security and analytics. We also treat performance, privacy and permissions as part of the design, choose native or cross-platform based on what the product needs, and prepare for App Store and Google Play review. After launch, updates and maintenance are planned in from the beginning. [Mobile app service](/services/mobile-app-design-development)",
      chips: [{ t: "More detail", go: "sec:app" }, { t: "Do I need an app?", go: "app_need" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "payment_terms", kind: "question", kw: ["payment plan", "payment plans", "installment", "installments", "instalment", "instalments", "pay in parts", "pay monthly", "deposit", "upfront", "how do i pay", "payment terms", "payment method", "payment methods", "pay later", "invoice"],
      a: ["Payment terms are agreed per project, so I can't state them here. In a short consultation we shape the scope and the price, and the team confirms exactly how payment works. Would you like me to pass your question on?"],
      pending: "handoff", chips: [{ t: "Yes, please", go: "handoff_start" }, { t: "Book a consultation", go: "consultation" }, { t: "Not now", go: "decline" }] },

    { id: "ownership_hosting", kind: "question", kw: ["who owns", "do i own", "own the code", "own the website", "ownership", "source code", "handover", "hand over", "my domain", "domain", "hosting", "hosted", "server", "domain name"],
      a: ["Details like ownership, hosting and domain depend on the platform and the project and are agreed in writing, so I don't want to guess. The team can answer this exactly. Would you like me to pass your question on?"],
      pending: "handoff", chips: [{ t: "Yes, please", go: "handoff_start" }, { t: "Not now", go: "decline" }] },

    { id: "revisions", kind: "question", kw: ["don't like the design", "dont like the design", "do not like the design", "revisions", "revision", "changes after", "change my mind", "not happy", "money back", "refund", "unhappy with", "if i dislike"],
      a: ["We start with clarity: the offer, audience and structure are agreed before the design begins, so the direction is aligned early. How revisions and changes are handled is agreed per project, so I can't state exact terms here. Would you like me to pass your question to the team?"],
      pending: "handoff", chips: [{ t: "Yes, please", go: "handoff_start" }, { t: "How do you work?", go: "process" }, { t: "Not now", go: "decline" }] },

    { id: "need_from_you", kind: "question", kw: ["what do you need from me", "what do i need to provide", "what do i need to prepare", "what should i prepare", "what information do you need", "what do i need to bring", "what do you need to start", "what do i need to have", "do i need to have anything ready"],
      a: ["At the start we need to understand your offer, your audience and your goals. If you already have a website, a logo, texts or images, that helps, but you don't need everything ready. The consultation is where we work out exactly what's needed."],
      chips: [{ t: "Book a consultation", go: "consultation" }, { t: "Free analysis", go: "free_analysis" }, { t: "How do you work?", go: "process" }] },

    { id: "not_on_google", kind: "faq", kw: ["showing on google", "show on google", "show up on google", "not showing up", "website is not showing", "site is not showing", "not showing on google", "not on google", "why am i not on google", "cant find my website", "cannot find my website", "doesnt show up", "doesn't show up", "not appearing", "not ranking", "no one finds me", "nobody finds me", "not found on google", "invisible on google", "google doesnt show", "my website doesnt show", "cant be found"],
      a: ["There can be several causes: pages that aren't indexed, a noindex setting, weak page structure, unclear service pages, missing local signals or technical problems. It's best to look at the actual site. The free website and search analysis is a good first step: we review your pages, the technology and the SEO issues, and send you a PDF by email within 48 hours. Would you like me to set it up?"],
      pending: "analysis", chips: [{ t: "Yes, set it up", go: "analysis_start" }, { t: "What's in it?", go: "analysis_detail" }, { t: "SEO details", go: "sec:seo" }, { t: "Not now", go: "decline" }] },

    { id: "ads_service", kind: "faq", kw: ["google ads", "facebook ads", "ad campaign", "ad campaigns", "run ads", "run my ads", "advertising", "ppc", "meta ads", "instagram ads", "do you do ads", "manage ads"],
      a: ["Running ad campaigns isn't one of our six services. What we do is build landing pages made for ad traffic, with the message, the form and the conversion tracking planned together, so the campaign sends people somewhere that works. [Landing page service](/services/landing-page)"],
      chips: [{ t: "Landing pages", go: "svc_landing" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "social_service", kind: "faq", kw: ["do you do social media", "social media management", "manage my social media", "run my social media", "manage social", "social media marketing", "post on social", "social media posts", "social media service", "social media content"],
      a: ["Managing social media accounts isn't one of our six services. Our brand system work does cover how your identity appears on social media: templates, visual rules and tone of voice. [Brand system service](/services/brand-system)"],
      chips: [{ t: "Brand system", go: "svc_brand" }, { t: "What do you offer?", go: "services" }] },

    { id: "ecommerce", kind: "faq", kw: ["ecommerce", "e-commerce", "webshop", "web shop", "online shop", "online store", "sell online", "sell products online", "we sell products", "i sell products", "woocommerce", "checkout", "shopping cart", "sell things online"],
      a: ["An online shop can be part of a website project. What matters most is clear structure, speed and a trustworthy path to purchase, and payment providers can be integrated depending on the scope. The details and the price depend on your products, languages and integrations, so a short consultation is the best next step."],
      chips: [{ t: "Website details", go: "sec:website" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "chatbot_ai", kind: "faq", kw: ["chatbot", "chat bot", "build a chatbot", "ai chatbot", "virtual assistant", "ai assistant", "bot for my website", "bot for my site", "bot for my business"],
      a: ["Chatbots aren't one of our six listed services, but AI-assisted workflows and automation are: classifying leads, summarising requests, drafting replies, always with clear limits and human approval where it matters. If you have a chatbot in mind, tell the team what it should do. [Automation service](/services/automation-systems)"],
      pending: "handoff", chips: [{ t: "Talk to the team", go: "handoff_start" }, { t: "Automation details", go: "sec:automation" }, { t: "Not now", go: "decline" }] },

    { id: "nda", kind: "question", kw: ["nda", "non disclosure", "non-disclosure", "confidential", "confidentiality", "keep it secret"],
      a: ["Terms like that are agreed per project, so I can't promise them here. Please raise it with the team, and I'm happy to pass your question on."],
      pending: "handoff", chips: [{ t: "Yes, please", go: "handoff_start" }, { t: "Not now", go: "decline" }] },

    { id: "company_size", kind: "question", kw: ["startups", "start ups", "start-ups", "big companies", "large companies", "small businesses", "enterprise", "corporate", "what kind of companies", "who do you work with", "what clients", "types of clients", "small company", "big business"],
      a: ["We work with businesses that want a sharper digital presence, stronger positioning and a clearer path from online attention to enquiries. Size matters less than having a clear goal. For a new business, the first priority is a clear offer and a page that explains it quickly. [Portfolio](/portfolio)"],
      chips: [{ t: "What do you offer?", go: "services" }, { t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "mobile_ok", kind: "faq", kw: ["work on mobile", "mobile friendly", "mobile-friendly", "responsive", "on phones", "on my phone", "on tablets", "on all devices", "look good on mobile", "work on phones"],
      a: ["Yes. Websites are built responsive and checked on mobile, tablet and desktop as separate usage contexts, across Safari, Chrome and Firefox on iOS, Android and desktop. [Website service](/services/websites)"],
      chips: [{ t: "Website details", go: "sec:website" }, { t: "Pricing", go: "pricing" }] },

    { id: "need_customers", kind: "question", kw: ["need customers", "more customers", "get customers", "find customers", "get clients", "more clients", "need clients", "get more leads", "need more business", "grow my business", "more sales", "attract customers", "attract clients", "need more enquiries"],
      a: ["The usual building blocks are a website that explains your offer clearly, search visibility (including local search if you serve a local area) and an easy way to make an enquiry. What fits depends on where you are now. Do you already have a website?"],
      chips: [{ t: "Yes, I have one", go: "existing_site" }, { t: "Not yet", go: "svc_website" }, { t: "SEO", go: "svc_seo" }] },

    { id: "pricing", kind: "question", kw: ["what's the damage", "whats the damage", "the damage for", "damage", "ballpark", "set me back", "what do you charge", "how much would", "cheapest", "cheapest option", "minimum budget", "price range", "ballpark figure", "rough price", "rough cost", "what does it cost", "price", "prices", "pricing", "cost", "costs", "how much", "quote", "budget", "rate", "rates", "fee", "fees", "vat", "charge", "package", "packages", "estimate", "starting from", "afford"],
      a: [] /* built in bot.js using topic */ },

    { id: "objection", kind: "question", kw: ["discounts", "offer discounts", "special offer", "promotion", "any deals", "cheaper option", "expensive", "too much", "too expensive", "cheaper", "cheap", "discount", "can't afford", "cannot afford", "out of my budget", "pricey", "lower price", "negotiate"],
      a: ["I understand, it's a real investment. We don't compete on being the cheapest. We focus on a clear offer, a site that builds trust and a path that turns visits into enquiries, so the money works for you. The most useful next step is a short consultation, where we look at your goals and shape the scope and price around them rather than around a fixed package."],
      chips: [{ t: "Book a consultation", go: "consultation" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "timeline", kind: "question", kw: ["how long does an app take", "how long does a website take", "how long does a site take", "how long does it take", "how long does a project take", "take to build", "take to make", "how soon", "when would it", "when will it be ready", "ready by", "by next month", "when can you start", "start date", "how quickly can you", "how many months", "how much time", "time does it take", "how long would", "how long is it going", "how long to build", "be ready", "how long", "how fast", "how quickly", "timeline", "turnaround", "deadline", "delivery time", "when will", "how many weeks", "how many days", "time frame", "timeframe", "lead time", "asap"],
      a: ["The timeline depends on the scope, so I can't promise dates here. The one timeline I can give is for the free analysis: you get it as a PDF by email within 48 hours. For a project, we agree the schedule after a short consultation."],
      chips: [{ t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "process", kind: "question", kw: ["how does the process work", "how does your process work", "how does the process", "what is the process", "what's the process", "how does it all work", "process", "how do you work", "how does it work", "how it works", "workflow", "your method", "methodology", "steps", "approach", "how do we start", "what happens first", "development method"],
      a: ["We start with clarity before design or development: your offer, target audience, message structure, user journey and conversion path. Then we build the structure, the design and the technical foundations, and after launch we review and keep improving based on data. [About our approach](/about)"],
      more: "In practice that means strategy sets the direction, design builds trust, development builds the experience, SEO improves visibility and ongoing optimisation keeps improving results.",
      chips: [{ t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "free_analysis", kind: "question", kw: ["free", "analysis", "analyse", "analyze", "audit", "review", "check my website", "check my site", "evaluate", "website review", "site review", "free review", "free analysis", "seo check", "feedback on my site", "look at my website"],
      a: ["We offer a free website and search analysis. We review your pages, the technology behind your site and your SEO issues, then send you a PDF by email within 48 hours with general recommendations for your own website. If you'd like to go further, we send an itemised quote for all the fixes. A detailed fix plan isn't part of the free analysis, and each company can request one free analysis. Would you like me to set it up?"],
      chips: [{ t: "Yes, set it up", go: "analysis_start" }, { t: "What's in it?", go: "analysis_detail" }, { t: "Not now", go: "decline" }],
      pending: "analysis" },

    { id: "analysis_detail", kind: "question", kw: ["what is in the analysis", "what's in it", "whats included in the analysis", "what do i get", "what do you check", "what does the analysis include"],
      a: ["The analysis covers a review of your pages, a look at the technology behind the site and the SEO issues we find, with general recommendations applied to your own website. It doesn't include a detailed fix plan. If you'd like one, we send an itemised quote for all the fixes. It arrives as a PDF by email within 48 hours."],
      chips: [{ t: "Yes, set it up", go: "analysis_start" }, { t: "Book a consultation", go: "consultation" }],
      pending: "analysis" },

    { id: "consultation", kind: "question", kw: ["consultation", "book a call", "schedule a call", "meeting", "book a meeting", "talk about my project", "discuss my project", "discovery call", "book a consultation"],
      a: ["A consultation is a conversation about your goals, where we shape the scope and the price around your project. I can pass your request to the team now. Shall I do that?"],
      chips: [{ t: "Yes, please", go: "handoff_start_consult" }, { t: "Not now", go: "decline" }],
      pending: "consult" },

    { id: "human", kind: "question", kw: ["talk to a human", "talk to a person", "talk to someone", "speak to someone", "speak to a human", "real person", "human", "contact me", "call me", "email me", "get in touch", "reach out", "someone from your team", "your team", "send this to the team", "speak to a person", "speak with a person", "talk with a person", "speak with someone", "talk with someone", "a real person", "customer service", "representative", "live agent", "human being", "real human", "senda til teymisins", "teymisins", "starfsmann", "send my question", "pass this on"],
      a: ["Of course. I can send this conversation to our team by email and they'll reply to you. Shall I do that?"],
      chips: [{ t: "Yes, please", go: "handoff_start" }, { t: "Not now", go: "decline" }],
      pending: "handoff" },

    { id: "contact", kind: "question", kw: ["your email", "what is your email", "email you", "call you", "can i call", "phone you", "office", "opening hours", "office hours", "visit you", "drop by", "whatsapp", "text you", "contact", "phone", "phone number", "telephone", "email address", "e-mail", "address", "where are you", "number", "reach you", "social media", "instagram", "linkedin", "facebook"],
      a: ["You can reach us at hello@mrkxlabs.com or +354 837 8339. Our address is 781 Höfn í Hornafirði, Iceland, and there's a contact form on the [contact page](/contact). We're also on Facebook, Instagram (mrkx.labs) and LinkedIn."],
      chips: [{ t: "Send to the team", go: "handoff_start" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "location", kind: "question", kw: ["where are you based", "location", "based in", "iceland", "reykjavik", "höfn", "hofn", "remote", "abroad", "outside iceland", "international", "worldwide", "nationwide", "all over iceland", "akureyri"],
      a: ["We're based in Höfn í Hornafirði and work with businesses across Iceland. We also work remotely, so location isn't a limit for projects."],
      chips: [{ t: "What do you offer?", go: "services" }, { t: "Contact", go: "contact" }] },

    { id: "portfolio", kind: "question", kw: ["towing company", "tow company", "road1 tow", "road 1 tow", "roadside company", "towing website", "who have you worked with", "who are your clients", "your clients", "worked with before", "other projects", "any projects", "portfolio", "examples", "example of your work", "previous work", "past work", "case study", "case studies", "references", "clients", "work you have done", "showcase", "road1tow"],
      a: ["Our publicly shown project is ROAD1 TOW, a towing and roadside assistance website for South Iceland: clear structure, a direct click-to-call path, local SEO foundations, a dark and yellow design and a matching business card. We're a young studio, and we'd rather show a few things we stand behind than a long list. [Portfolio](/portfolio)"],
      chips: [{ t: "Road1 Tow case study", go: "sec:portfolio" }, { t: "How do you work?", go: "process" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "platform", kind: "question", kw: ["wix", "wordpress", "shopify", "squarespace", "webflow", "which platform", "what platform", "what technology", "tech stack", "cms", "what do you build with", "custom code"],
      a: ["The right platform depends on your project, your team and how you'll maintain the site. We decide that together during the consultation instead of pushing one tool for everything."],
      chips: [{ t: "Book a consultation", go: "consultation" }, { t: "Website service", go: "svc_website" }] },

    { id: "why_us", kind: "rule", kw: ["why you", "why should i choose", "why choose you", "better than", "compare", "competitor", "competitors", "other agencies", "other studios", "different from", "what makes you different", "versus", "vs"],
      a: ["We can't speak for other agencies, but here's how we work. We start from your offer and audience, treat the website as a business system rather than a brochure, and focus on clarity, credibility and action. If that sounds like what you need, a short consultation will show quickly whether we're a good fit."],
      chips: [{ t: "How do you work?", go: "process" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "seo_guarantee", kind: "faq", kw: ["guarantee", "guaranteed", "first page", "rank first", "number one", "top of google", "#1", "first place", "top 3", "page one", "promise", "ensure ranking"],
      a: ["We can't guarantee rankings, and nobody honest can, because search engines control them. What we do is work on what we can influence: technical foundations, page structure, content clarity, local relevance and measurement. We also don't guarantee specific conversion rates."],
      chips: [{ t: "How long does SEO take?", go: "seo_time" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "seo_time", kind: "faq", kw: ["how long does seo", "seo take", "when will i see results", "seo results", "time for seo", "results from seo", "how soon rank", "seo timeline"],
      a: ["SEO progress is gradual. Some technical problems can be fixed and noticed fairly quickly, but meaningful organic growth often takes longer because search engines need time to recrawl and reassess your pages."],
      chips: [{ t: "One-time or ongoing?", go: "seo_ongoing" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "seo_ongoing", kind: "faq", kw: ["one time", "one-time", "ongoing", "monthly seo", "continuous seo", "seo retainer", "is seo a project", "maintain seo", "keep doing seo"],
      a: ["It can start as a defined project, but search visibility keeps changing with competitors, user behaviour and platform requirements. The usual approach is to build a strong base first and then refine it based on data."],
      chips: [{ t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "monthly_plans", kind: "faq", kw: ["monthly plan", "monthly plans", "monthly package", "monthly packages", "monthly price", "monthly fee", "per month", "retainer", "subscription", "care plan", "growth plan", "partner plan", "ongoing support", "ongoing package", "minimum term", "contract length", "minimum contract", "minimum commitment", "lock in", "cancel monthly"],
      a: ["We offer three monthly plans, all plus VAT, with a 6-month minimum and a 48-hour response time. Care (30,000 ISK/month): hosting and domain oversight, security updates, one small content change per month and a short monthly status note. Growth (80,000 ISK/month): everything in Care plus monthly SEO work (Search Console, titles, local SEO), Google Business Profile upkeep and a monthly report. Partner (140,000 ISK/month): everything in Growth plus up to 3 hours of development per month, a fixed monthly call and a quarterly strategy review. Capacity is limited, so the Partner plan is available for a small number of clients."],
      chips: [{ t: "Book a consultation", go: "consultation" }, { t: "Pricing", go: "pricing" }] },

    { id: "local_seo", kind: "faq", kw: ["local seo", "google business profile", "google maps", "google my business", "near me", "local search", "reviews"],
      a: ["Local SEO improves your visibility and trust for location-based searches by aligning your website, your Google Business Profile, reviews and business details. A Google Business Profile alone isn't enough, because your website has to reinforce the same information."],
      chips: [{ t: "SEO service", go: "svc_seo" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "new_ranking", kind: "faq", kw: ["will a new website rank", "new website rank", "automatically rank", "new site rank", "will my site rank", "get found on google", "show up on google"],
      a: ["Not automatically. A well-built site gives search engines a better starting point, but rankings also depend on content, competition, authority and ongoing optimisation."],
      chips: [{ t: "SEO service", go: "svc_seo" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "builder_seo", kind: "faq", kw: ["website builder", "site builder", "drag and drop", "does wix hurt seo", "builder hurt seo", "no code seo", "template seo"],
      a: ["Not automatically. Website builders can support SEO, but the result depends on correct configuration, crawlable content, proper metadata and internal linking."],
      chips: [{ t: "Free analysis", go: "free_analysis" }] },

    { id: "website_edit", kind: "faq", kw: ["change things myself", "update it myself", "make changes myself", "change it myself", "manage it myself", "edit things myself", "change the text myself", "update the text", "do the updates myself", "edit the website myself", "edit it myself", "update the website myself", "edit my site", "change content myself", "update content", "can i edit", "cms access", "manage content"],
      a: ["Yes, for appropriate content such as text, images, blog posts, portfolio items and FAQs. Layout, tracking, SEO configuration and integrations are handled more carefully, to protect the stability of the site."],
      chips: [{ t: "After launch", go: "after_launch" }, { t: "Website service", go: "svc_website" }] },

    { id: "after_launch", kind: "faq", kw: ["after launch", "after the website is launched", "after it goes live", "post launch", "maintenance", "support after", "what happens after", "go live"],
      a: ["Launch is a checkpoint, not the end. After going live we review forms, responsiveness, metadata, analytics, indexing, links, redirects and performance under real conditions."],
      chips: [{ t: "Pricing", go: "pricing" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "analytics", kind: "faq", kw: ["analytics", "tracking", "ga4", "google analytics", "search console", "conversion tracking", "measure", "measurement", "statistics"],
      a: ["Yes. Analytics can be part of the website foundation: GA4 and Search Console, form submissions, button clicks and the key conversion events. We focus on tracking the actions that actually matter to your business."],
      chips: [{ t: "Website service", go: "svc_website" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "multilingual", kind: "faq", kw: ["multilingual", "two languages", "english and icelandic", "icelandic version", "translate", "translation", "languages", "bilingual", "another language"],
      a: ["A multilingual site needs deliberate planning: localised URLs, language-specific metadata, linked page versions and consistent navigation, so it stays maintainable and clear to search engines. Our own site works in English and Icelandic."],
      chips: [{ t: "Website service", go: "svc_website" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "landing_vs_site", kind: "faq", kw: ["landing page or website", "landing page vs website", "do i need a landing page", "landing page if i have a website", "difference between landing page", "landing page instead of website"],
      a: ["Yes, they serve different purposes. A landing page is a focused destination for one campaign, audience or offer, while a general homepage can make visitors hunt for what they came for."],
      chips: [{ t: "Landing page service", go: "svc_landing" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "landing_conv", kind: "faq", kw: ["conversion rate", "guarantee conversion", "increase conversions", "more leads guarantee", "more sales guarantee", "will it increase sales"],
      a: ["We can't guarantee a specific conversion rate. Results depend on traffic quality, pricing and your sales process, so we focus on a sound page, reliable measurement and evidence-based improvements."],
      chips: [{ t: "Landing page service", go: "svc_landing" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "copywriting", kind: "faq", kw: ["copywriting", "copy", "text for the website", "write the content", "who writes the text", "content writing", "wording"],
      a: ["It can be part of the scope. We develop conversion copy from your audience, offer, objections and the action you want people to take, rather than adding placeholder text after the design."],
      chips: [{ t: "Landing page service", go: "svc_landing" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "automation_what", kind: "faq", kw: ["what can be automated", "what can you automate", "automate my", "automation examples", "replace human work", "does automation break"],
      a: ["Repetitive, rule-based tasks such as lead handling, CRM updates, follow-up emails, reporting, notifications and booking workflows. Tasks that need consistent human judgment may only be partly supported."],
      chips: [{ t: "Automation service", go: "svc_automation" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "app_need", kind: "faq", kw: ["do i need an app", "need a mobile app", "does my business need an app", "when does an app make sense", "app or website", "website into an app", "is an app worth it"],
      a: ["Not every business needs one. An app makes sense when users need repeat access, accounts, offline use, push notifications or a focused experience. We always check first whether an app is the right solution."],
      chips: [{ t: "Mobile app service", go: "svc_app" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "brand_vs_logo", kind: "faq", kw: ["brand system vs logo", "is a brand system a logo", "difference between logo and brand", "just a logo", "cheap logo", "need a brand system", "logo or brand"],
      a: ["No. A logo is one part of an identity, while a brand system defines how that identity works across visuals, messaging, digital platforms and future assets."],
      chips: [{ t: "Brand service", go: "svc_brand" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "website_included", kind: "faq", kw: ["what is included", "what's included", "what does a website project include", "included in a website", "what do i get with", "scope of a website"],
      a: ["A professional website project goes beyond visual design. It includes information architecture, responsive development, content structure, technical SEO, performance, accessibility, forms, analytics and integrations, treated as one connected system."],
      chips: [{ t: "Pricing", go: "pricing" }, { t: "Website service", go: "svc_website" }] },

    { id: "performance", kind: "faq", kw: ["performance", "page speed", "pagespeed", "core web vitals", "slow website", "site speed", "load time", "fast website", "lighthouse"],
      a: ["Speed, responsiveness and visual stability shape the user experience, and unmanaged scripts, images or third-party tools can hurt them. Core Web Vitals are useful indicators, though not a complete measure of quality."],
      chips: [{ t: "Free analysis", go: "free_analysis" }] },

    { id: "accessibility", kind: "faq", kw: ["accessibility", "accessible", "wcag", "screen reader", "contrast", "alt text"],
      a: ["Accessibility should be considered from the start: semantic headings, contrast, alt text, labelled forms and keyboard use. It doesn't replace a dedicated audit if you need a formal certification."],
      chips: [{ t: "Website service", go: "svc_website" }] },

    { id: "security", kind: "faq", kw: ["security", "secure", "hacked", "spam forms", "ssl", "https", "safe website", "protect my site"],
      a: ["We handle it at a practical level: safer forms, spam reduction, controlled admin access, careful use of third-party tools and clear technical ownership, to reduce avoidable risk."],
      chips: [{ t: "Website service", go: "svc_website" }] },

    { id: "howstart", kind: "question", kw: ["first step", "what is the first step", "how do i begin", "how to begin", "how can i get started", "what is next", "whats next", "where to begin", "get started", "start a project", "start my project", "begin", "how do i start", "next step", "where do i start", "ready to start", "let's start", "start your project", "work with you", "hire you"],
      a: ["The easiest first step is the free website and search analysis, if you already have a site. If you're starting from scratch, a short consultation is better. Which fits you?"],
      chips: [{ t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "existing_site", kind: "question", kw: ["i already have a website", "my current website", "my existing site", "my site is slow", "my site is old", "not getting enquiries", "no leads", "no traffic", "my website is not working", "improve my website", "fix my website"],
      a: ["Then the free analysis is the best starting point. We look at your current pages, technology and SEO issues and send you general recommendations for your own site within 48 hours."],
      chips: [{ t: "Yes, set it up", go: "analysis_start" }, { t: "What's in it?", go: "analysis_detail" }] },

    { id: "just_looking", kind: "question", kw: ["just looking", "just browsing", "just curious", "only looking", "not sure yet", "maybe later", "thinking about it", "only asking"],
      a: ["No problem, take your time. If it helps, I can tell you how we work or what a typical first step looks like. There's no pressure."],
      chips: [{ t: "How do you work?", go: "process" }, { t: "What do you offer?", go: "services" }] },

    { id: "privacy", kind: "question", kw: ["privacy", "privacy policy", "cookies", "cookie policy", "terms", "terms and conditions", "data protection", "my data", "personal data", "what do you do with my messages"],
      a: ["This chat works in your browser, and nothing is sent to us unless you ask me to pass your message to the team. If you do, we email the conversation to our team. You'll find our Privacy Policy, Cookie Policy and Terms at the bottom of every page."],
      chips: [{ t: "Talk to the team", go: "human" }] },

    { id: "legal_tax", kind: "rule", kw: ["gdpr", "do you comply with gdpr", "is it gdpr", "legal advice", "lawyer", "attorney", "tax advice", "accountant", "gdpr compliant", "gdpr compliance", "is it legal", "sue", "liability", "contract law", "compliance"],
      a: ["I can't give legal or tax advice, and we don't offer it. For questions like that, please talk to a qualified professional. I can tell you what we build and how, if that helps."],
      chips: [{ t: "What do you offer?", go: "services" }] },

    { id: "medical", kind: "rule", kw: ["medical", "doctor", "health advice", "diagnosis", "medicine", "symptom", "symptoms", "therapy", "treatment", "illness"],
      a: ["I can't help with medical or health questions. Please contact a healthcare professional. I'm happy to help with questions about our web, SEO and digital services."],
      chips: [{ t: "What do you offer?", go: "services" }] },

    { id: "offtopic", kind: "rule", kw: ["weather", "joke", "poem", "football", "recipe", "news", "politics", "movie", "song", "homework", "translate this"],
      a: ["That's outside what I can help with. I'm here for questions about MRKX Labs: our services, prices, process and the free analysis."],
      chips: [{ t: "What do you offer?", go: "services" }, { t: "Free analysis", go: "free_analysis" }] }
  ];

  var fallbackFirst = [
    "I'm not sure I understood that. I can tell you about our services, prices, process and the free analysis, or you can ask me something more specific.",
    "I didn't quite catch that. Could you say it a little differently? Or pick one of the topics below."
  ];
  var fallbackSecond = "I can't answer that one well. I'd rather not guess, so I can send your question to our team and they'll reply by email. Shall I do that?";

  var bizMap = [
    { key: "hospitality", words: ["restaurant", "cafe", "coffee", "bakery", "bar", "hotel", "guesthouse", "hostel", "catering", "food", "kitchen", "bistro"], line: "For hospitality businesses, the website's job is usually simple and urgent: show the offer, build trust and make booking or contact effortless." },
    { key: "tourism", words: ["tour", "tours", "tourism", "travel", "excursion", "glacier", "activity", "activities", "rental", "camping"], line: "For tourism, clear offers, strong local search and an easy booking path usually matter most." },
    { key: "shop", words: ["shop", "store", "ecommerce", "e-commerce", "webshop", "online store", "retail", "products"], line: "For shops, structure, performance and a trustworthy path to purchase usually make the biggest difference." },
    { key: "trades", words: ["plumber", "electrician", "construction", "builder", "contractor", "repair", "mechanic", "cleaning", "towing", "transport", "trades", "carpenter"], line: "For service businesses, local search visibility and a clear enquiry path usually matter most." },
    { key: "startup", words: ["startup", "start-up", "starting a company", "starting a business", "start a business", "start a company", "just started", "new company", "new business", "starting", "launch", "idea", "founder", "new company"], line: "For a new business, the first priority is a clear offer and a page that explains it fast, before adding anything else." },
    { key: "pro", words: ["consultant", "consulting", "agency", "lawyer", "accountant", "coach", "freelancer", "designer", "photographer", "studio", "clinic", "salon", "gym"], line: "For professional services, trust signals and a clear explanation of what you do are what turns visitors into enquiries." }
  ];

  return { intents: intents, links: links, priceWeb: P_WEB, priceSeo: P_SEO, priceApp: P_APP,
           fallbackFirst: fallbackFirst, fallbackSecond: fallbackSecond, bizMap: bizMap };
})();

/* MRKX Assistant: detailed service knowledge, one section per topic of each service page.
   Facts only from mrkxlabs.com/services/*. No rankings, results or timelines are promised anywhere in here. */
var MRKX_SECTIONS = {
  website: {
    name: "website", url: "/services/websites",
    intro: "Our website work covers the full build, from structure to measurement. Pick a topic and I'll go into detail:",
    items: [
      { t: "What's included", kw: ["included", "include", "includes", "what is included", "scope", "deliverables", "what do you build", "what do i get", "everything"],
        a: "A website project covers far more than visual design. It includes information architecture, a responsive front end, a structured and editable content setup, technical SEO foundations, performance, accessibility basics, secure form handling, analytics and measurement, integrations with your business tools, and maintenance and scalability planning. Choose any of these and I'll explain how we handle it. The exact scope depends on pages, languages, integrations and content. [Website service](/services/websites)" },
      { t: "Structure", kw: ["information architecture", "site structure", "website structure", "page structure", "page hierarchy", "navigation", "url structure", "service pages", "sitemap planning", "plan the pages"],
        a: "Every website project starts with information architecture, before any visual design. We define which pages are needed, how they relate, how the navigation works and how visitors move from general to specific content. That covers page hierarchy, URL structure, service-page planning, content grouping and internal linking. For a service business, each offer gets its own page with more depth and more focused SEO targeting, instead of one overloaded homepage. A planned structure also keeps the site from turning messy as pages are added later." },
      { t: "Design & build", kw: ["responsive", "front end", "frontend", "browser", "safari", "tablet", "mobile friendly", "device", "devices", "how is it built", "development"],
        a: "The front end is built from consistent layout rules, reusable components, typography systems and clear interface states (hover, focus, form errors), not random sections placed by hand. Responsive means more than shrinking the desktop view: we think about content order, navigation, button placement, forms and readability separately for mobile, tablet and desktop, including mouse, keyboard and touch. We also check browser differences across Safari, Chrome, Firefox, iOS and Android, so the site behaves the same in real use and not only in a preview." },
      { t: "Editing & content", kw: ["cms", "content management", "editable", "edit the content", "update content", "manage content", "content structure", "content types", "editor"],
        a: "A business website should be easy to update without becoming unstable. We organise recurring content (services, portfolio items, case studies, FAQs, blog posts, legal pages) into structured content types, so new pages stay consistent and nothing has to be copied by hand. You get practical control over the content you really need to manage, while the structure, design consistency, SEO settings and technical setup stay protected. Good content structure also helps SEO and makes future growth easier." },
      { t: "Technical SEO", kw: ["technical seo", "seo foundation", "seo foundations", "metadata", "meta description", "title tag", "heading", "headings", "canonical", "sitemap", "structured data", "indexing"],
        a: "SEO foundations are part of the build from day one, not an afterthought. That includes crawlable and indexable pages, clean title tags and meta descriptions, a logical heading hierarchy, canonical handling, an XML sitemap, structured data where it fits, internal links and a clear URL structure. This gives the site a strong technical base. It doesn't replace ongoing SEO strategy, content production or link building, and it doesn't promise rankings. [SEO service](/services/seo)" },
      { t: "Performance", kw: ["performance", "page speed", "site speed", "fast", "speed", "core web vitals", "image optimization", "layout stability", "loading", "slow"],
        a: "Performance is part of quality: how quickly content appears, how stable the page feels while loading and how responsive it is. We handle image optimisation, script control, third-party embeds, loading behaviour, layout stability, responsive media and Core Web Vitals awareness. Many sites are slow not because of the design but because too many tools load at once (analytics, pixels, cookie banners, chat widgets, maps, video). Each script should have a purpose. The goal is not a perfect test score but a site that feels fast and stable in real conditions." },
      { t: "Accessibility", kw: ["accessibility", "accessible", "screen reader", "contrast", "wcag", "alt text", "keyboard navigation", "disability"],
        a: "We build with accessibility principles from the start: semantic headings, readable contrast, meaningful alt text, clear link text, labelled form fields, keyboard-aware interaction, visible focus states and responsive readability. The aim is to avoid common mistakes such as fake headings, unlabelled forms, missing focus states and low contrast. We're careful about one thing: building with accessibility in mind does not mean claiming full legal compliance, which would need a dedicated accessibility audit." },
      { t: "Security & forms", kw: ["security", "secure", "spam", "form handling", "contact form", "access control", "reliability", "permissions", "hacked"],
        a: "Even a standard business website has parts that need care: contact forms, editor access, tracking scripts, embeds and integrations. We reduce avoidable risk with safer form handling (validation, spam reduction, reliable notifications), controlled access so editors can't accidentally damage structure or SEO settings, and careful use of third-party scripts, since each one is a dependency. If a form connects to email, a CRM or a spreadsheet, we test the whole flow. We handle this practically; it isn't enterprise cybersecurity." },
      { t: "Analytics", kw: ["analytics", "ga4", "google analytics", "search console", "tracking", "measurement", "measure", "conversion tracking", "events"],
        a: "A website should be measurable from launch. We can set up GA4, connect Search Console and track the actions that matter: contact form submissions, phone and email clicks, bookings, quote requests, service-page visits and key CTA clicks. We deliberately don't track everything blindly; we define the meaningful actions first. Search Console shows which pages and queries get impressions and whether there are indexing problems, which matters especially after launching new service pages." },
      { t: "Integrations", kw: ["integration", "integrations", "crm", "booking", "payment", "payments", "api", "email notification", "connect the website", "workflow"],
        a: "A website often has to connect to the systems behind the business: forms, CRM tools, email notifications, booking and payment systems, spreadsheets, calendars and external APIs. We plan these as part of the website system, not as small add-ons, because a poorly built form flow can lose leads silently. We also stay realistic about third-party limits such as authentication, limited documentation and unsupported workflows, and explain them before promising an automated process. [Automation service](/services/automation-systems)" },
      { t: "After launch", kw: ["maintenance", "scalability", "scalable", "multilingual", "post launch", "grow", "templates", "qa", "future updates"],
        a: "We build for change: reusable templates for new services, case studies or localised pages, editable content, documentation and multilingual readiness (localised URLs, language-specific metadata, translated navigation). After launch we check forms, responsive behaviour, indexing status, analytics events, broken links, metadata, speed issues and redirects. Launch is when the site enters real use, not when quality control ends." }
    ]
  },

  seo: {
    name: "SEO", url: "/services/seo",
    intro: "We treat SEO as search infrastructure, not a ranking trick. Pick a topic and I'll go into detail:",
    items: [
      { t: "Technical foundation", kw: ["technical seo", "technical foundation", "crawl", "crawling", "indexing", "index", "robots", "noindex", "canonical", "redirect", "redirects", "sitemap", "search console"],
        a: "Before content can perform, the site must be accessible. Technical SEO makes sure search engines can crawl and render your pages, understand the hierarchy and index the right URLs. We review sitemap logic, robots.txt, noindex settings, canonical URLs, redirects, internal links, heading hierarchy, mobile rendering, page speed, JavaScript behaviour, structured data and Search Console validation. A polished site that search engines can't crawl or index correctly is a hidden website, so we check the infrastructure before treating content as the fix." },
      { t: "Page architecture", kw: ["search intent", "page architecture", "site structure", "service page", "service pages", "page structure", "keywords", "keyword"],
        a: "Every SEO page needs a reason to exist. A homepage can't answer every search, and a thin services page rarely earns enough trust from a serious buyer. So each important service gets a clear search purpose, a defined audience, a logical place in the site and a path to the next step. We don't start with keywords alone; we build around the questions a real customer asks before they trust, compare, contact or buy." },
      { t: "Content", kw: ["content", "copy", "copywriting", "blog", "blog posts", "write", "writing", "articles"],
        a: "We build content around clarity, not volume. Strong SEO content is specific, useful and grounded in real decisions: it explains what matters, where mistakes happen and how a better system works, rather than repeating a keyword. For service businesses it should show that you understand the problem, answer objections and guide the visitor to the next step. The goal is to make each page easier for search engines to interpret and easier for customers to trust." },
      { t: "AI search", kw: ["ai search", "ai overview", "ai overviews", "chatgpt", "generative", "llm", "ai seo", "geo", "aeo"],
        a: "AI search doesn't remove the need for SEO; it raises the standard. We don't chase AI-search hacks, empty acronyms or artificial mention campaigns, which may disappear with the next update. We focus on the fundamentals that make a business easy to understand for search engines and AI systems alike: accessible pages, structured information, clear service definitions, helpful answers, consistent business details and content with real substance. The goal is to make the business clear enough to be interpreted correctly." },
      { t: "Local SEO", kw: ["local seo", "local search", "google business profile", "google maps", "maps", "near me", "reviews", "icelandic business", "iceland"],
        a: "For local businesses, SEO is also about being understood in a specific market. Local SEO connects your website, Google Business Profile, service areas, categories, reviews, contact details, structured data and location relevance into one consistent presence. Local customers often search with immediate intent: who provides this, where, and can I trust them. Many Icelandic businesses have incomplete profiles or unclear service pages, so a clearer structure can be a real advantage. We build local SEO around clarity, consistency and trust, not just map visibility." },
      { t: "Structured data & metadata", kw: ["structured data", "schema", "schema markup", "metadata", "meta description", "title tag", "titles", "rich results", "json ld"],
        a: "Schema is a clarity layer, not a ranking shortcut. Structured data helps machines interpret organisation details, local business information, services, pages, breadcrumbs and FAQs where appropriate. Metadata matters too, but isn't the whole strategy: the title tag, meta description, heading, URL and visible content should all communicate the same core meaning. We align them so every page sends a clear signal about what it covers, who it's for and what to do next." },
      { t: "Performance", kw: ["performance", "page speed", "site speed", "core web vitals", "fast", "speed", "slow"],
        a: "Performance supports SEO, but speed alone is not a strategy. A fast page is valuable because it improves access, usability and conversion; a fast page with weak content is still weak. We treat performance as part of the larger system: pages that load reliably, stay stable, work across devices and support the visitor's next step, not just a better score." },
      { t: "Measurement", kw: ["measurement", "measure", "report", "reports", "reporting", "analytics", "accountability", "traffic", "results", "track"],
        a: "SEO shouldn't hide behind vague monthly reports. You should understand what was fixed, what improved, what is still weak and how it connects to business outcomes. We look at measurable signals: indexed pages, search queries, impressions, clicks, technical issues, page performance, service-page visibility, local presence and conversion paths. Traffic alone isn't the goal; the question is whether the right searches bring the right visitors to the right pages, and whether they can act." },
      { t: "What the work includes", kw: ["what is included", "what does it include", "scope", "deliverables", "what do you do", "approach", "process", "how do you work", "seo review"],
        a: "Our SEO work can include a technical SEO review, site structure improvement, service-page planning, metadata optimisation, structured data, local SEO alignment, Search Console review, performance checks, internal linking, content restructuring and analytics visibility. Each part has a purpose: technical SEO makes the site accessible, content structure makes the business understandable, local SEO makes it relevant in its market, and measurement makes the work accountable. We don't sell ranking promises; we build the conditions that make visibility possible and measurable. [SEO service](/services/seo)" }
    ]
  },

  landing: {
    name: "landing page", url: "/services/landing-page",
    intro: "A landing page is built for one audience, one offer and one next step. Pick a topic and I'll go into detail:",
    items: [
      { t: "Why pages fail", kw: ["why landing pages fail", "fail", "not converting", "low conversion", "underperform", "problems", "mistakes"],
        a: "Landing pages rarely fail because of one button or colour. They fail because the decision path is unclear. Typical causes: the page doesn't match the campaign message that brought the visitor, it talks about the company instead of the customer, the offer is hard to understand, claims come without evidence, too many actions compete for attention, the form asks too much or too little, or the page goes live without reliable measurement. Design alone can't compensate for an undefined offer." },
      { t: "Audience & offer", kw: ["audience", "offer", "campaign", "traffic source", "strategy", "research", "who is it for"],
        a: "Before any layout, we clarify who the page is for and why they arrive: the audience, traffic source, level of awareness, campaign message, the problem or desired outcome and the action the campaign should generate. Someone coming from a high-intent Google search needs a different experience from someone discovering you on social media. We also help sharpen the offer itself: what the customer gets, why it's relevant, how it differs from alternatives, what evidence supports it and what could stop the visitor from acting." },
      { t: "Messaging & copy", kw: ["copy", "copywriting", "messaging", "headline", "message", "conversion copy", "text", "wording"],
        a: "The page is structured around the questions a potential customer needs answered before acting: am I in the right place, what exactly is offered, what outcome can it create, how does it work, why trust you, how is it different, what happens after I respond. The goal isn't to put every piece of information on the page; it's to remove the important uncertainties that stop the right visitor from taking the next step. Copy starts from the customer's problem or goal, with your business as the credible way forward." },
      { t: "Design & UX", kw: ["design", "ux", "user experience", "visual hierarchy", "layout", "wireframe", "mobile", "hierarchy"],
        a: "The design supports the decision path. Typography, spacing, imagery, contrast, content order, proof placement and call-to-action position are used to control attention and make the most important information hard to miss; the aim is not to decorate the offer. We design mobile separately instead of shrinking the desktop version, looking at content order, tap targets, CTA visibility, form behaviour and performance on small screens." },
      { t: "Trust & proof", kw: ["trust", "proof", "evidence", "testimonials", "reviews", "case study", "case studies", "credibility", "social proof"],
        a: "Words like premium, trusted and results-driven are easy to publish; the real question is whether the visitor has a reason to believe them. Depending on the project we use testimonials, case studies, client logos, reviews, project outcomes, screenshots, demonstrations, credentials, process explanations or examples of completed work. Different claims create different doubts, so evidence is placed where the uncertainty occurs, not added as an afterthought at the bottom of the page." },
      { t: "Forms & conversion", kw: ["form", "forms", "cta", "call to action", "button", "booking", "lead form", "conversion mechanics", "submission"],
        a: "We define how the visitor moves from interest to action: the primary call to action, button language, CTA placement, form length, required and optional fields, qualification logic, booking steps, confirmation messages and what happens after submission. A short form may raise volume but lower quality, and a long one adds friction, so the right choice depends on the offer, the visitor's intent and your sales process. Every field should have a purpose, and the form must handle errors, confirm success and send the data to the right place." },
      { t: "Tracking", kw: ["tracking", "analytics", "measurement", "measure", "conversion tracking", "events", "ads", "lead quality"],
        a: "Measurement is planned before the page gets campaign traffic. Depending on the project we can track primary CTA clicks, form starts and submissions, phone calls, bookings, downloads, purchases and advertising conversions. Where the wider system allows it, we also look at lead quality and downstream outcomes, not just the number of submissions. Without dependable measurement, optimisation becomes guesswork." },
      { t: "What a project includes", kw: ["included", "include", "includes", "what is included", "scope", "deliverables", "what do i get", "project"],
        a: "The exact scope depends on the campaign, your assets and existing systems. A professional landing-page project can include strategy and research, messaging and copy (value proposition, headline, proof structure, FAQ, form microcopy), UX and design (information architecture, wireframe, custom design, responsive layout, trust placement), development and integrations (performance, accessible forms, email notifications, CRM, booking, payment, analytics) and testing before launch (forms, conversion events, browsers, error states, integrations). [Landing page service](/services/landing-page)" },
      { t: "Systems behind it", kw: ["crm", "automation", "email", "integration", "integrations", "follow up", "notifications", "systems behind"],
        a: "A landing page is only as strong as the system behind it. It can lose opportunities if notifications fail, an enquiry goes to the wrong person, the automated reply breaks, the CRM doesn't record the lead, the business responds too slowly or nobody can tell which campaign produced a result. Depending on the project we can connect the page with email systems, CRM platforms, booking tools, payment providers, spreadsheets, advertising platforms, analytics or custom automation workflows. [Automation service](/services/automation-systems)" },
      { t: "Testing & optimisation", kw: ["testing", "a b test", "ab test", "optimization", "optimisation", "improve", "cro", "experiment"],
        a: "There's no universal best headline, page length, button colour or form structure, so optimisation starts by finding the real bottleneck: traffic quality, campaign targeting, message mismatch, weak positioning, thin proof, unclear copy, form friction, technical performance, unreliable tracking or poor follow-up. When traffic is high enough we test variations against a defined hypothesis; when it isn't, we improve through campaign analysis, user feedback, usability review, form diagnostics and controlled sequential changes. We don't call a variation a winner based on a handful of visitors." }
    ]
  },

  brand: {
    name: "brand system", url: "/services/brand-system",
    intro: "A brand system defines how a business looks, communicates and stays consistent. Pick a topic and I'll go into detail:",
    items: [
      { t: "Brand system vs logo", kw: ["logo", "brand vs logo", "more than a logo", "difference", "what is a brand system"],
        a: "A logo is a visual mark; a brand system defines how that identity works in real situations. A logo alone doesn't explain how a website should look, how typography scales, how colours behave on buttons, how content should sound or how future assets get made. That's where brands start to break: the logo looks good in isolation, but the business feels inconsistent across its website, social media, ads, documents and email. A brand system turns visual identity into a usable operating structure." },
      { t: "What it includes", kw: ["include", "includes", "included", "what is included", "contain", "elements", "components", "what do i get", "deliverables", "receive"],
        a: "A brand system can include positioning and identity direction, logo usage rules, a colour system with functional logic, a typography hierarchy with responsive direction, layout and spacing principles, image and icon direction, tone of voice, social media and marketing asset structure, website and landing-page visual rules, accessibility and contrast considerations, export-ready assets, a Figma-ready structure and usage documentation. The value isn't the number of assets but how clearly they work together; the exact scope depends on your business and current brand. [Brand system service](/services/brand-system)" },
      { t: "Fragmented branding", kw: ["inconsistent", "fragmented", "consistency", "consistent", "drift", "different people", "freelancers"],
        a: "Most brand problems show up after the brand starts being used. One person makes a social post, another edits a web section, a freelancer designs an ad, a developer builds a page, each making small visual decisions without a shared system. Over time colours shift, fonts become inconsistent, layouts lose structure and the tone changes with whoever writes. Every new asset then takes longer and every campaign risks weakening the identity. A brand system gives future decisions a clear reference point." },
      { t: "Digital & technical layer", kw: ["digital", "technical", "tokens", "responsive", "figma", "design tokens", "typography scale", "accessibility", "contrast", "website"],
        a: "Modern branding has a technical layer. A digital brand system should work across websites, mobile interfaces, responsive layouts, SEO content structures and campaign pages. That can include structured colour logic, typography scales, responsive spacing, reusable layout rules, interface-ready components, accessibility-safe colour combinations, export-ready assets and documentation that supports implementation. For more advanced systems, decisions can become tokens and variables so colours, sizes, spacing and radius stay consistent between design files and code. This is what separates a usable system from a static brand board." },
      { t: "Details that matter", kw: ["favicon", "details", "small screens", "mobile", "buttons", "dark", "contrast", "fonts", "font"],
        a: "Small brand details have large consequences. A logo that works on a slide may fail as a favicon; a premium font may load badly on a website; a beautiful palette may fail accessibility for text or buttons; a heading style may be unreadable on mobile. We consider these before they become problems and define how the brand behaves on small screens, in dark sections, inside forms, on call-to-action buttons, in navigation, in social templates and on content-heavy pages." },
      { t: "Guidelines & handoff", kw: ["guidelines", "handoff", "hand off", "brand guidelines", "documentation", "pdf", "usage", "assets"],
        a: "Guidelines are useful but aren't the whole system. A PDF can explain rules without guaranteeing they're followed: files get lost, people use outdated assets and contractors make assumptions. So we organise the system practically, with a clear file structure, usable assets, real examples, digital-ready formats and a defined hierarchy that makes correct usage easier than incorrect usage. A brand system shouldn't be created only to be approved; it should be created to be used." },
      { t: "Our approach", kw: ["approach", "process", "how do you work", "different", "why mrkx", "infrastructure", "strategy"],
        a: "We treat branding as digital business infrastructure, not decoration. Before designing, we look at your business, positioning, audience, services, digital touchpoints and the role the brand plays across the customer journey. Then we build a system that connects identity with execution, so the brand isn't designed separately from the website, content, SEO structure, mobile experience or future marketing. Colours, typography, layout rules and voice are tested against real use: buttons, service pages, mobile screens, CTAs and emails." }
    ]
  },

  automation: {
    name: "automation", url: "/services/automation-systems",
    intro: "We design automation as workflow systems, starting from your process and not from a tool. Pick a topic and I'll go into detail:",
    items: [
      { t: "What we automate", kw: ["what can be automated", "what can you automate", "areas", "examples", "use cases", "tasks", "cover", "covers"],
        a: "We can help automate repeated operational steps that slow teams down or make follow-up inconsistent: lead capture and routing, CRM updates, website form workflows, booking and appointment processes, client onboarding, email follow-up sequences, internal notifications, task creation, spreadsheet and database synchronisation, reporting, document handling, AI-assisted classification, customer request summaries and repetitive admin. The best opportunities are usually things your business repeats every day, every week or every time a new customer arrives." },
      { t: "Leads & CRM", kw: ["lead", "leads", "crm", "lead handling", "follow up", "qualification", "pipeline"],
        a: "New leads can be captured, categorised, stored, assigned and followed up automatically. That can include form submissions, lead-source tracking, CRM updates, internal notifications, follow-up reminders, qualification logic and a structured handoff to the right person. Instead of manually checking where a lead came from and what happens next, the system creates a cleaner first-response process." },
      { t: "Client onboarding", kw: ["onboarding", "client onboarding", "welcome", "new client", "customer onboarding"],
        a: "Onboarding often repeats the same steps: collecting information, creating folders, sending welcome emails, assigning tasks, scheduling meetings, preparing documents and updating internal systems. Automation can turn that into a consistent workflow. The goal isn't to remove the personal relationship; it's to remove the repetitive administration around it." },
      { t: "Tasks & notifications", kw: ["tasks", "task", "notifications", "notification", "alerts", "internal", "project board", "slack"],
        a: "Small operational delays often happen because the right person doesn't know something needs attention. Automation can create tasks, send alerts, update project boards, notify teams and keep internal systems synchronised when specific events happen. This reduces missed steps, slow responses and communication gaps." },
      { t: "Reliability", kw: ["reliable", "reliability", "errors", "error handling", "monitoring", "fail", "failure", "logs", "retry", "break", "breaks"],
        a: "A workflow isn't finished just because it worked once. A serious automation system is designed for incomplete data, duplicate entries, failed API calls, expired connections and unexpected behaviour. That means clear trigger logic, input validation, field mapping, duplicate handling, retry logic, error notifications, execution logs, access control, fallback paths, documentation and clear ownership. If a workflow fails silently, it isn't saving time; it's creating hidden risk. The system should also show what happened when something goes wrong." },
      { t: "How it's built", kw: ["technical", "layers", "workflow logic", "integration logic", "data structure", "api", "apis", "webhook", "webhooks", "tools", "zapier", "make com", "n8n", "how is it built"],
        a: "A good automation system has several layers. Workflow logic defines the process (trigger, condition, action, notification, log). Integration logic connects tools through APIs, webhooks, low-code platforms, databases, spreadsheets, CRMs, email and calendars, handling authentication, field mapping and failed requests. Data structure comes next: we first ask which system is the source of truth. Then error handling and monitoring, and finally human control over which steps stay manual or need approval." },
      { t: "AI in workflows", kw: ["ai", "artificial intelligence", "chatgpt", "gpt", "llm", "ai assisted", "ai agent", "ai agents"],
        a: "AI can help where a workflow needs interpretation rather than simple rules: summarising customer requests, classifying leads, drafting responses, extracting information from documents or prioritising tickets. But it shouldn't be added everywhere. If a simple rule is safer, cheaper and more predictable, we use the rule. A responsible AI-assisted workflow defines what the AI can read, suggest and change, when approval is required, how outputs are reviewed and which data must stay protected. We use AI as a controlled support layer, not an uncontrolled employee." },
      { t: "Process first", kw: ["process", "where to start", "messy", "unclear", "approach", "how do you work", "before automation"],
        a: "Bad automation doesn't fix a messy process; it makes the mess move faster. So we begin with the workflow, not a template: the current process, the systems involved, the data being moved, decision points, manual steps, exceptions and risks. Not everything should be automated immediately. If the workflow is unclear, the data unreliable or the risk too high, the first step is simplifying the process. We help identify what to automate, what to improve first and where human approval should stay." }
    ]
  },

  app: {
    name: "mobile app", url: "/services/mobile-app-design-development",
    intro: "We treat a mobile app as a product system, not just a set of screens. Pick a topic and I'll go into detail:",
    items: [
      { t: "Do you need an app?", kw: ["do i need an app", "need an app", "should i build an app", "app or website", "right solution", "worth it", "is an app", "web app"],
        a: "Not every business problem needs a mobile app. Some are better solved with a stronger website, a web application, a booking system, a customer portal, an internal tool or an automated workflow. An app makes sense when the mobile experience adds clear value: repeat usage, accounts, offline access, push notifications, saved preferences, location features, camera access or a focused experience users return to regularly. We question the format before choosing the technology, and if a simpler system fits better, we say so." },
      { t: "First version", kw: ["first version", "mvp", "minimum", "core action", "features", "scope", "prototype", "start small"],
        a: "The first version shouldn't try to include every future feature. App projects become expensive and unclear mostly because too much is added too early. Before features, we define the core action: the main thing the user needs to do, book, request, track, submit or repeat in the app. With that clear, the journey and interface become simpler and the technical foundation follows real product logic. A good first version isn't a weak one; it's a focused version built to prove the right thing." },
      { t: "Architecture", kw: ["architecture", "structure", "backend", "accounts", "authentication", "login", "data models", "api", "apis", "database", "permissions", "technical"],
        a: "The visible interface is only one part. Behind it sits the structure that controls how the product works: user accounts, authentication, data models, APIs, business logic, permissions, app and loading states, error handling, analytics, security and the release process. If this is weak, the app may look fine in a prototype but be hard to test, maintain or scale. We plan this structure before changes become expensive." },
      { t: "Performance", kw: ["performance", "speed", "fast", "slow", "crash", "battery", "startup", "caching", "stable", "stability"],
        a: "Mobile performance directly shapes how users feel about the product: slow opening, freezing, battery drain, awkward loading or crashes create doubt, while a responsive app creates trust. It's decided early by technical choices such as startup time, caching, rendering, dependencies, API calls, SDK usage, image handling, data loading and background processes. We consider performance during planning, design, development and testing on real devices." },
      { t: "UX in real conditions", kw: ["ux", "user experience", "design", "ui", "offline", "weak connection", "error states", "loading states", "navigation", "screens"],
        a: "Mobile UX is about what happens when something changes or fails: what the user sees while content loads, when the connection is weak, when a request fails, when they deny a permission, when they close the app halfway through or return later. Mobile users are often distracted or moving, so we design clear navigation, helpful feedback, loading, empty and error states, permission explanations and recovery paths, not only the ideal flow." },
      { t: "Privacy & permissions", kw: ["privacy", "permissions", "data safety", "personal data", "gdpr", "location", "camera", "notifications", "push", "sdk", "data"],
        a: "Privacy and security shape an app from the start; they aren't end-of-project paperwork. Apps can involve user accounts, personal data, messages, location, push notifications, payments, uploaded files, analytics, third-party SDKs and external integrations, and each affects how the app is planned, built, explained and submitted to the stores. Permissions affect trust too: asking for camera, location or contacts too early or without a reason makes users hesitate. We consider what data is collected, why, where it goes and how that affects the user experience and store review." },
      { t: "Launch & stores", kw: ["app store", "google play", "store", "stores", "launch", "release", "submission", "review", "publish", "testflight"],
        a: "Launching is more than finishing development. We prepare for real release: device testing, performance checks, crash handling, store assets, descriptions, privacy information, permission review, analytics setup, demo access if needed and a complete build ready for App Store and Google Play review. Privacy details, data-safety information, screenshots, metadata, login access and build completeness all affect the review process, so store submission isn't treated as a last-minute upload." },
      { t: "Technology", kw: ["native", "cross platform", "cross-platform", "react native", "flutter", "swift", "kotlin", "ios", "android", "technology", "tech stack", "framework"],
        a: "The technology should be chosen around the product, not the other way around. Native development suits apps that depend heavily on platform-specific performance, device features or complex background behaviour. A cross-platform approach suits businesses that want to launch on iOS and Android efficiently with one shared codebase. There's no universal answer; it depends on the business case, performance needs, integrations, user expectations, maintenance, timeline, budget and roadmap." },
      { t: "After launch", kw: ["maintenance", "updates", "support", "after launch", "bug fixes", "long term", "monitoring", "roadmap"],
        a: "A mobile app needs work after launch: updates, monitoring, bug fixes, dependency maintenance, operating-system compatibility checks, analytics review, user feedback and future improvements. We plan for this from the beginning and build apps as structured digital products, not isolated design projects, so they stay useful, reliable and maintainable. [Mobile app service](/services/mobile-app-design-development)" }
    ]
  },
  portfolio: {
    name: "portfolio", url: "/portfolio",
    intro: "Our public project is ROAD1 TOW, a towing and roadside assistance website for South Iceland, with a full case study and the live site. We treat every project as a structured business system rather than visual decoration.",
    items: [
      { t: "Our approach to portfolio work", kw: ["approach", "how you treat projects", "business system", "portfolio approach", "what do you look at", "evaluate", "how do you judge", "system based"],
        a: "We treat each project as a structured business system, not as visual decoration: strategy, message, design, development, SEO foundations and conversion paths work together. Each project is judged by how well it supports the business behind it, including visual trust, mobile responsiveness, SEO structure, service clarity, user journey and contact flow. [Portfolio](/portfolio)" },
      { t: "Road1 Tow: the project", kw: ["road1 tow", "road1tow", "road 1 tow", "road1", "towing", "roadside", "tow truck", "what did you build", "case study", "south iceland"],
        a: "ROAD1 TOW is an Iceland-based towing and roadside assistance company serving drivers in South Iceland. We built a clean, service-driven website with clear information, strong contact visibility and a structure that supports quick decision-making. Besides design and development, the work included local SEO foundations, Google visibility setup, technical configuration, policy page setup and supporting business assets. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: the challenge", kw: ["challenge", "problem", "goal", "urgent", "emergency", "stuck on the road", "what did they need", "why"],
        a: "People looking for towing usually have an urgent, specific need, often searching from a phone. The site had to answer three questions fast: can this company help, do they operate in my area, and how can I contact them now. In South Iceland, weather, wind, snow, ice and long distances make that clarity matter even more. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: structure and click-to-call", kw: ["click to call", "call button", "phone number", "structure", "ux", "user experience", "contact path", "mobile", "direct call"],
        a: "The structure brings the main contact action forward and keeps the core services easy to scan. A key part was the direct click-to-call path: instead of copying or searching for a number, drivers can call with one tap, which matters when every extra step adds friction. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: design direction", kw: ["design", "colors", "colours", "dark", "yellow", "visual", "look", "branding", "style", "layout"],
        a: "The visual direction uses a dark layout with strong yellow contrast, which fits the roadside assistance industry and keeps key actions and service messages clearly visible. The design avoids unnecessary decoration and focuses on function, readability and trust, and was built for desktop, tablet and mobile with particular attention to mobile usability. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: copywriting", kw: ["copy", "copywriting", "text", "messaging", "content", "wording", "tone"],
        a: "The copy was written for fast understanding: what services are available, where the company operates and how to get help. It uses direct, practical language for towing, vehicle recovery, battery support and roadside help, with a simple and confident tone instead of broad promotional claims. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: technology", kw: ["technology", "tech", "built with", "html", "css", "javascript", "code", "front end", "responsive", "how was it built"],
        a: "The front end uses HTML, CSS and JavaScript where custom layout behaviour and interactive elements were needed. The design was turned into reusable patterns such as structured sections, responsive image areas, call-to-action elements and consistent spacing rules, with attention to image optimisation, metadata, social preview settings and favicon setup. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: local SEO", kw: ["seo", "local seo", "google", "search console", "google business profile", "maps", "indexing", "visibility", "found"],
        a: "The project included on-page SEO, page titles, meta descriptions, service relevance, image optimisation, indexing setup, Google Search Console, Google Business Profile and Google Maps integration, built into the website foundation from the start to support local discovery for towing and roadside searches in South Iceland. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: technical setup and policy pages", kw: ["domain", "cookie", "policy", "privacy", "terms", "favicon", "social share", "launch setup", "technical setup"],
        a: "The setup covered domain configuration, favicon, social share settings, image upload and optimisation, a cookie banner and the creation of Privacy Policy, Cookie Policy and Terms & Conditions pages. This was policy page setup and implementation support, not legal compliance advice. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: business card", kw: ["business card", "print", "qr code", "offline", "card"],
        a: "A business card was designed as an offline contact point: company name, phone number, website, QR code and a clear roadside assistance message, in the same dark and yellow style as the website so the brand stays consistent across digital and physical touchpoints. [Road1 Tow case study](/portfolio-case-study-road1tow)" },
      { t: "Road1 Tow: the result", kw: ["result", "outcome", "results", "what changed", "achieved", "impact"],
        a: "The result is a more professional online presence, clearer service communication and faster access to contact options for drivers in South Iceland. The site works as a practical service touchpoint rather than a static brochure: it explains the offer, supports trust, strengthens local search presence and gives a direct path to contact. [Road1 Tow case study](/portfolio-case-study-road1tow)" }
    ]
  }
};

/* MRKX Assistant: FAQ knowledge, taken from mrkxlabs.com/faq (83 questions, answers lightly condensed, same claims).
   t = service topic, q = question as on the FAQ page, a = answer. */
var MRKX_FAQ = [
  /* ---- Landing pages ---- */
  { t: "landing", q: "Do I need a landing page if I already have a website?", a: "A website and a landing page serve different purposes. Your website introduces the full business and supports several visitor journeys; a landing page is a focused destination for one campaign, audience, service or offer. Sending campaign traffic to a general homepage often forces visitors to search for the relevant information themselves." },
  { t: "landing", q: "Can you guarantee a specific conversion rate?", a: "No credible provider can guarantee a conversion rate without understanding the traffic, market, offer, pricing, competition, customer intent and sales process. We focus on a strategically sound page, reliable measurement, identifying the assumptions behind the offer and a foundation that can be improved using evidence." },
  { t: "landing", q: "Will a new landing page fix my advertising campaign?", a: "Only if the landing page is the real bottleneck. Poor targeting, irrelevant keywords, weak ads, limited demand, an uncompetitive offer, unreliable tracking or slow sales follow-up can't be solved by page design alone. We evaluate the landing page as part of the wider acquisition and conversion path." },
  { t: "landing", q: "How long should a landing page be?", a: "Long enough to support the decision, but not longer. A simple, familiar, low-risk offer may need very little explanation; a complex, expensive or unfamiliar service may need more proof, process information, comparison, objection handling and risk reduction. The length should follow the complexity of the decision, not a fixed template." },
  { t: "landing", q: "Should a landing page have navigation?", a: "Not always. Removing the main navigation can reduce distraction on a focused campaign page, but some visitors may need supporting information, legal pages, company details or extra credibility signals. The right decision depends on the campaign and the visitor's needs." },
  { t: "landing", q: "Is copywriting included in a landing page project?", a: "Copywriting can be included in the project scope. Conversion copy isn't placeholder text added after the design; it requires an understanding of the audience, offer, objections, available evidence and desired action. The depth of research and writing depends on the project." },
  { t: "landing", q: "Can you connect the landing page to our existing systems?", a: "In many cases, yes. The page may be connected to CRM software, email systems, booking platforms, payment providers, analytics tools, advertising platforms, spreadsheets or automation workflows. Integration requirements should be identified before development begins." },
  { t: "landing", q: "Does a landing page need SEO?", a: "It depends on the purpose. A short-term paid campaign page may not need to compete in organic search, while a service landing page meant to attract search traffic needs a different content, indexing, internal-linking and technical SEO strategy. We decide this intentionally rather than letting search visibility happen by accident." },
  { t: "landing", q: "Can the landing page be optimized after launch?", a: "Yes. Optimisation can use conversion data, campaign performance, lead quality, customer feedback, form behaviour, usability findings and structured experiments when there is enough traffic. The method should match the amount and quality of evidence available." },

  /* ---- Websites ---- */
  { t: "website", q: "What is included in a professional website design and development project?", a: "A professional website project includes more than visual design and page building. It covers the structural, technical, content, performance, SEO, accessibility, security, analytics, integration and maintenance layers: information architecture, page hierarchy, responsive front end, CMS or content structure, technical SEO foundations, performance optimisation, accessibility basics, form handling, analytics setup, integrations and post-launch quality checks. We treat a website as a complete digital system; the exact scope depends on the business, goals, functionality and chosen technology." },
  { t: "website", q: "Is website design the same as website development?", a: "No. Design defines the visual and user-experience layer: layout, spacing, typography, hierarchy, visual identity, content presentation and navigation flow. Development turns it into a working technical system: responsive behaviour, browser compatibility, front end, content management, forms, tracking, technical SEO settings, integrations and launch preparation. A site can look well designed and still be technically weak (slow, broken on mobile, poor headings, no tracking, hard to update), so a professional site needs both." },
  { t: "website", q: "Why does information architecture matter?", a: "Information architecture defines how the website is organised: page hierarchy, navigation logic, URL structure, service-page planning, internal linking and content grouping. Without it a site can be confusing even if it looks polished, and search engines may get weak signals about how pages relate. For service businesses the homepage introduces the business while individual service pages explain each offer properly, giving a clearer structure, stronger internal linking and a better technical foundation." },
  { t: "website", q: "Do I need separate pages for each service?", a: "In most cases, yes. If each service has a different audience, problem, process, technical explanation or search intent, separate service pages are usually the stronger structure. A single overview page can introduce the offers but rarely explains each in depth. Dedicated pages allow detailed explanations, specific FAQs, links to case studies and more focused search intent." },
  { t: "website", q: "What is technical SEO in a website build?", a: "Technical SEO is the foundation that helps search engines crawl, index and understand a website. It isn't a shortcut or ranking trick. It can include crawlable pages, indexable structure, clear title tags, meta descriptions, logical headings, canonical handling, XML sitemap setup, structured data where appropriate, optimised URLs and internal links. We consider it during the build, not only after launch; it doesn't replace long-term SEO strategy, content or authority building." },
  { t: "website", q: "Will a new website automatically rank on Google?", a: "No. A new website doesn't rank well just because it's well designed or technically clean. A professional site creates a stronger foundation, but rankings depend on content quality, competition, search intent, authority, location, technical structure, internal linking, indexing and ongoing optimisation. Technical SEO during the build avoids preventable problems, but it doesn't guarantee immediate rankings." },
  { t: "website", q: "Why are headings important?", a: "Headings aren't only visual styling; they define the structure of the page. A clear H1 describes the main topic and H2/H3 headings organise supporting sections in a logical order, which helps users scan and understand the content and helps search engines understand the hierarchy. If headings are used only for visual size, the page becomes harder to interpret." },
  { t: "website", q: "Why does website performance matter?", a: "Performance affects how quickly users can access content, how stable the page feels while loading and how responsive it is during interaction. It's influenced by image sizes, scripts, fonts, animations, tracking and cookie tools, embedded maps, video players, booking and payment tools and other third-party resources. We review media, scripts, embeds, layouts, responsive behaviour and tracking tools during the build, so each technical element has a clear purpose and doesn't needlessly damage the experience." },
  { t: "website", q: "What are Core Web Vitals?", a: "Core Web Vitals are user-experience metrics for loading performance, interactivity and visual stability. Largest Contentful Paint measures how quickly the main content loads, Interaction to Next Paint how responsive the page feels, and Cumulative Layout Shift whether the page moves unexpectedly while loading. They aren't the only measure of quality, but they can reveal heavy images, slow scripts, unstable layouts, poor mobile performance or excessive third-party load." },
  { t: "website", q: "Is accessibility part of website development?", a: "Yes. Accessibility means making the site easier to perceive, navigate, understand and operate for as many people as possible, including people using keyboards, screen readers, assistive technologies, mobile devices and different browsers. Basics include semantic headings, readable contrast, meaningful alt text, labelled form fields, clear links, keyboard-aware interaction, visible focus states, logical content order and responsive readability. This doesn't mean every site automatically gets full legal accessibility certification without a dedicated audit." },
  { t: "website", q: "Can I edit the website myself after launch?", a: "Yes, where appropriate. Editable content may include text, images, blog posts, portfolio items, FAQs, service content, case studies or selected CMS-based sections. Not every part should be freely editable: core layout structure, tracking setup, technical SEO configuration, integrations, design systems and responsive behaviour are handled carefully. The goal is practical editing control without making the website fragile." },
  { t: "website", q: "What is the difference between structured content and manually built pages?", a: "Structured content is organised into repeatable content types and fields: a service can have a title, descriptions, image, related FAQ, SEO title, meta description and call-to-action; a portfolio item can have a project name, industry, challenge, solution, result and gallery. Manually built pages rely on copied sections and one-off layouts, which is harder to maintain as the site grows. Structured content makes the site more scalable and consistent." },
  { t: "website", q: "Are integrations included in a website project?", a: "Integrations can be included depending on the scope. A website integration connects the site to another system: a contact form, CRM, email notifications, booking platform, payment provider, automation workflow, spreadsheet, calendar, marketing platform or external API. They're planned carefully because they affect operations; a form may need to send an email, store a lead, trigger an automated reply or update a CRM. When included, they're treated as part of the website system." },
  { t: "website", q: "How do you handle website forms?", a: "A form should not only look correct; it should submit reliably, validate input, reduce spam, notify the right people and support tracking. Depending on the project that includes contact, quote, booking, newsletter and CRM-connected forms, automated notifications, confirmation messages and analytics events. A weak setup can lead to lost leads, spam, failed notifications or missing conversion tracking, so forms are tested as functional systems." },
  { t: "website", q: "Do you set up analytics and tracking?", a: "Yes, analytics and tracking can be part of the website foundation: GA4 setup, Search Console connection, form submission tracking, CTA tracking, traffic-source visibility, key event setup and basic conversion-path measurement. The goal isn't to track everything randomly but to define which actions matter and make them measurable. A website without tracking creates blind spots." },
  { t: "website", q: "What happens after the website is launched?", a: "Launch isn't the end. After launch the site should be checked in real conditions: testing forms, responsive behaviour, metadata, analytics events, Search Console setup, indexing status, broken links, redirects, important user flows and performance. Some issues only appear when real users, devices, search engines and third-party systems interact with the site." },
  { t: "website", q: "Can the website be expanded later?", a: "Yes, if it's built with scalability in mind. A scalable site supports future service pages, portfolio items, case studies, blog posts, FAQs, landing pages, multilingual versions, additional integrations and content updates without a complete rebuild. That takes structure: reusable templates, CMS content types, consistent design patterns, internal linking logic, documentation and technical discipline." },
  { t: "website", q: "Is multilingual website structure important?", a: "Yes. A multilingual website isn't just a translated copy. It needs clear page relationships, localised URLs, language-specific metadata, translated navigation, consistent structure and attention to how search engines understand the language versions. Without planning, pages become inconsistent between languages, links point to the wrong version and metadata gets duplicated. It should be considered at the architecture stage." },
  { t: "website", q: "How is website security handled?", a: "Security is handled at the practical website level: safer form handling, spam reduction, controlled CMS or admin access, careful use of third-party tools, reliable integration planning and clear technical ownership. Not every business site needs enterprise security infrastructure, but every site should avoid unnecessary risk and stay stable and maintainable after launch." },
  { t: "website", q: "Why should a website be treated as a system instead of a brochure?", a: "Because a modern business website is connected to search engines, mobile devices, analytics, forms, content management, third-party scripts, automation workflows and business processes. Treated as a brochure, important layers get ignored and the site may be hard to find, hard to update, slow on mobile, unclear for search engines, inaccessible, insecure or impossible to measure. Design is one layer; the value comes from combining structure, usability, technical SEO, performance, accessibility, measurement, integrations and maintainability." },

  /* ---- Automation ---- */
  { t: "automation", q: "What exactly can be automated?", a: "The best candidates are repetitive, structured, rule-based or data-driven tasks: lead handling, CRM updates, follow-up emails, onboarding steps, reporting, notifications, task creation, booking workflows and internal admin processes. If a task needs complex human judgement every time, it may not suit full automation, but automation can still support it by preparing information, creating reminders or organising the next step." },
  { t: "automation", q: "Can automation replace human work?", a: "The goal isn't to remove people from the business; it's to remove unnecessary repetition from the system. Automation is most valuable when it reduces manual admin, repeated data entry, missed follow-ups and slow internal handoffs, while keeping people in control of important decisions." },
  { t: "automation", q: "Is AI automation safe?", a: "It can be useful, but only when it's controlled. AI shouldn't get more authority than the workflow requires. For higher-risk tasks the system should include approval points, limited permissions, review steps and clear boundaries around what the AI can access or change." },
  { t: "automation", q: "Why not just use Zapier, Make or n8n myself?", a: "You can, and for simple workflows these tools are often enough. The difference appears when a workflow becomes important to the business: then you need data mapping, error handling, duplicate prevention, access control, logs, testing, documentation and a recovery path. Tools can create automations; they don't automatically create reliable systems." },
  { t: "automation", q: "What happens if the automation breaks?", a: "A serious automation system shouldn't fail silently. Depending on the workflow it should include notifications, logs, fallback paths, retry logic and a clear owner who knows what to do if something fails. Automation should make operations easier to manage, not harder to diagnose." },
  { t: "automation", q: "Do you only build no-code automations?", a: "No. We use no-code or low-code tools where they're the right fit, but the approach depends on the workflow. Some projects work with platforms like Zapier, Make, n8n, Airtable, Notion, Google Workspace or CRM integrations; others need APIs, webhooks, custom backend logic, databases or a hybrid setup. The tool is chosen after the workflow is understood." },

  /* ---- Mobile apps ---- */
  { t: "app", q: "Do I actually need a mobile app?", a: "Not every business needs one. Some problems are better solved with a stronger website, web application, booking system, customer portal, internal tool or automated workflow. We identify whether a mobile app is the right solution before development begins." },
  { t: "app", q: "When does a mobile app make sense?", a: "When users need repeated access, account-based functionality, offline support, push notifications, saved preferences, location-based features, camera access, faster workflows or a focused experience they return to regularly." },
  { t: "app", q: "Can my website just be turned into an app?", a: "A mobile app shouldn't simply be a website placed inside an app shell. It should provide a meaningful mobile experience with clear functionality, structure and value beyond what the mobile web already offers." },
  { t: "app", q: "How many features should the first version include?", a: "The features needed to prove the core action. The first version shouldn't try to become the final product immediately; a focused first version is easier to launch, test, improve and maintain." },
  { t: "app", q: "Is a smaller first version a weaker product?", a: "No. A smaller first version can be stronger if it's built around the right user behaviour. The goal isn't to reduce quality but to avoid unnecessary complexity before the product direction is proven." },
  { t: "app", q: "Should my app be native, cross-platform or web-based?", a: "It depends on the product. Native development may be better for platform-specific performance or advanced device features, cross-platform when the business needs iOS and Android efficiently, and a web-based solution may be enough when app-store distribution isn't necessary." },
  { t: "app", q: "Why does mobile app architecture matter?", a: "Architecture affects how stable, maintainable, testable and scalable the app becomes. An app isn't only interface design; it includes data flow, authentication, APIs, permissions, error handling, analytics, security and release processes." },
  { t: "app", q: "Why is mobile app performance important?", a: "Performance directly affects trust. If an app opens slowly, freezes, drains battery, crashes or reacts late, users experience it as a product problem, not just a technical one." },
  { t: "app", q: "What does good mobile UX include?", a: "More than a clean layout: navigation, loading states, feedback, empty states, error states, permission explanations, recovery paths and behaviour under real conditions such as weak internet or interrupted sessions." },
  { t: "app", q: "When should privacy and data safety be considered?", a: "From the beginning. Privacy, permissions and data safety affect the app structure, user experience, third-party tools, store submission and long-term risk." },
  { t: "app", q: "What is needed before submitting an app to the App Store or Google Play?", a: "The app should be complete, tested and technically stable, with store assets, metadata, privacy information, data-safety details, screenshots, login or demo access if needed and a clear release plan." },
  { t: "app", q: "Is launch the end of the app project?", a: "No. After launch an app still needs monitoring, updates, bug fixes, dependency maintenance, operating-system compatibility checks, analytics review, user feedback and future improvements." },

  /* ---- Brand systems ---- */
  { t: "brand", q: "Is a brand system the same as a logo?", a: "No. A logo is one part of the identity; a brand system defines how the full identity works across visuals, messaging, layout, digital platforms, marketing assets and future content. A logo can make a business visible; a brand system makes it consistent and recognisable." },
  { t: "brand", q: "Do small businesses really need a brand system?", a: "Yes, if they want to look professional across more than one channel. Even small businesses use websites, Google Business Profile, social media, ads, email, proposals, invoices and presentations, and without a system these touchpoints start to feel disconnected. A brand system helps build trust without redesigning everything each time a new asset is needed." },
  { t: "brand", q: "Why not just buy a cheap logo?", a: "A cheap logo may give you a visual mark but usually doesn't solve the real brand problem. It doesn't define typography, content style, colour usage, website structure, button behaviour, social templates, mobile readability, accessibility rules or future design direction, so you may still have to guess everything else later." },
  { t: "brand", q: "What makes a brand system technical?", a: "The technical part is how the identity is prepared for real digital use: colour values, contrast-safe combinations, typography scales, spacing rules, responsive behaviour, component logic, file formats, design variables, export structure and documentation for designers and developers. It's about how reliably the brand can be implemented." },
  { t: "brand", q: "Can a brand system be used for a website or mobile app later?", a: "Yes, and that's one of the main reasons to create it properly. A strong system gives future websites, landing pages, mobile interfaces, SEO content and marketing campaigns a consistent foundation and reduces guesswork." },
  { t: "brand", q: "What happens if a business has no brand system?", a: "The brand usually becomes inconsistent over time: different people make different decisions, colours drift, fonts change, layouts lose structure, social media stops matching the website and new assets feel disconnected. It isn't always dramatic at first, but it slowly weakens recognition, trust and professional appearance." },
  { t: "brand", q: "Is a brand system only visual design?", a: "No. A serious brand system includes visual identity but also structure, communication, digital usage rules and practical implementation logic. The visual layer makes the brand recognisable; the system makes it usable." },

  /* ---- SEO ---- */
  { t: "seo", q: "Is SEO a guaranteed way to rank first on Google?", a: "No. Serious SEO shouldn't be sold as a guaranteed first-place ranking. Search engines use complex systems no outside company controls. What can be controlled is the quality of the technical foundation, page structure, content clarity, local relevance and measurement. We don't sell ranking promises; we build the conditions that make organic visibility possible, measurable and commercially useful." },
  { t: "seo", q: "How long does SEO take to show results?", a: "SEO usually works through controlled improvement, not instant change. Some technical fixes can be detected quickly, especially those that remove crawl, indexing or page-structure problems. Stronger organic growth often takes longer because search engines need time to crawl changes, evaluate pages and respond to competition. The timeline depends on the current state of the site, market competition, technical issues, content quality, authority and how specific the search opportunity is." },
  { t: "seo", q: "Is SEO a one-time project or an ongoing process?", a: "It can start as a focused project, but search visibility is never completely static. A site can be technically improved, restructured and optimised in one phase, but search behaviour, competitors, content expectations, local signals and platform requirements change over time. For many businesses the best approach is to build a strong foundation first, then improve based on data." },
  { t: "seo", q: "Why should I invest in SEO if results are not guaranteed?", a: "Because the alternative is leaving organic visibility to chance. SEO doesn't guarantee a specific ranking, but it reduces avoidable weakness: the site becomes easier to crawl and understand, better aligned with search intent, more credible to users and more useful as a business entry point." },
  { t: "seo", q: "What is technical SEO?", a: "Technical SEO is the work that helps search engines access, crawl, render, understand and index the right pages: sitemap structure, robots.txt, noindex settings, canonical URLs, redirects, internal links, heading hierarchy, JavaScript rendering, mobile usability, performance, structured data and Search Console validation. Without this foundation, content may exist on the site but fail to perform in search." },
  { t: "seo", q: "Can a beautiful website still have poor SEO?", a: "Yes. A site can look polished to users and still be hard for search engines to understand: important content hidden behind weak structure or JavaScript issues, poor internal linking, duplicate URLs, missing metadata, slow loading or unclear hierarchy. Visual quality matters, but search readiness depends on what the site communicates technically and structurally." },
  { t: "seo", q: "Does a modern website builder hurt SEO?", a: "Not automatically. Modern platforms can support SEO, but they still need correct configuration, clean page structure, crawlable content, clear metadata, proper indexing settings, performance control, structured data and consistent internal linking. The platform isn't the strategy; the implementation is." },
  { t: "seo", q: "Why does JavaScript matter for SEO?", a: "JavaScript can affect how search engines see a page. If important content, links, metadata or structured data only appear after scripts run, the page needs careful testing; search engines may process JavaScript, but rendering adds complexity. We check what users see, what browsers render and what search engines can actually access." },
  { t: "seo", q: "What is the difference between crawlability and indexability?", a: "Crawlability means search engines can access and follow a page; indexability means the page is eligible to be stored and shown in results. A page can be crawlable but not indexable if it has a noindex directive, and a page blocked from crawling may stop search engines seeing important instructions. A small technical setting can decide whether a page can appear in search at all." },
  { t: "seo", q: "Is SEO just about keywords?", a: "No. Keywords reveal what people search for, but SEO isn't keyword stuffing. A strong page needs a clear purpose, useful information, topic relevance, proper headings, internal links, metadata, local signals and a path toward action. The goal is to answer the search intent better than competing pages, not to repeat a phrase." },
  { t: "seo", q: "Do service pages matter for SEO?", a: "Yes, often more than generic blog content. A service page can target a specific commercial search intent, explain the offer in depth, answer objections, show expertise, support local relevance and guide the visitor toward contact. We treat service pages as structured business entry points." },
  { t: "seo", q: "Do we need blog posts for SEO?", a: "Not always. Blogs are useful when they answer real questions, support topical authority and connect to service pages, but generic articles published just to do SEO are usually weak. For many small and service-based businesses the priority is clear core pages, strong service pages, local relevance and technical correctness before large amounts of blog content." },
  { t: "seo", q: "What makes SEO content good?", a: "Good SEO content is specific, useful, structured and written for real decision-making. It explains the problem, answers practical questions, shows expertise, removes confusion and helps the visitor decide what to do next. It shouldn't sound like generic AI text or repeat the same keyword in slightly different ways." },
  { t: "seo", q: "Is SEO still relevant with AI search?", a: "Yes. AI search doesn't remove the need for SEO; it raises the standard for technical clarity, useful content, structured information and trust signals. Search engines and AI systems still need accessible pages, clear service definitions, reliable information and content that can be interpreted correctly." },
  { t: "seo", q: "Do I need AEO, GEO or a separate AI SEO strategy?", a: "Not as a replacement for SEO. Terms like AEO and GEO describe visibility in AI search experiences, but the practical foundation is still SEO: crawlable pages, useful content, clear structure, trustworthy information and consistent business signals. We don't chase AI-search hacks; we build pages that are easier for search engines, AI systems and customers to understand." },
  { t: "seo", q: "Do I need an llms.txt file for Google Search?", a: "No, not for Google Search visibility. The priority is making the site technically accessible, well structured, useful and clear. Special files or artificial AI-focused tricks aren't a substitute for a strong search foundation." },
  { t: "seo", q: "Should content be written differently for AI systems?", a: "Written more clearly, not more artificially. AI systems and search engines benefit from pages that are well organised, specific, helpful and supported by real context. That doesn't mean breaking every answer into tiny fragments or rewriting the site only for machines; the best approach is useful content for people with a structure machines can interpret." },
  { t: "seo", q: "What is local SEO?", a: "Local SEO helps a business become more visible and trustworthy for location-based searches. It connects the website, Google Business Profile, service areas, business categories, reviews, contact details, local content, structured data and business information into one consistent presence. For local businesses this can matter as much as traditional website SEO." },
  { t: "seo", q: "Is a Google Business Profile enough for local SEO?", a: "No. A Google Business Profile is important but shouldn't work alone. The website needs to support the same business information, services, location relevance, contact details and trust signals; if the website and profile don't reinforce each other, the presence becomes weaker and less consistent." },
  { t: "seo", q: "Why are reviews important for local SEO?", a: "Reviews help customers evaluate trust before they contact a business, and when they're genuine, relevant and consistent over time they can support local prominence and credibility. They're not only a ranking consideration but part of the decision path." },
  { t: "seo", q: "Does schema markup improve rankings?", a: "Schema isn't a ranking shortcut. Structured data helps search engines understand information on a page more explicitly and can support eligible rich results in some cases, but it shouldn't be treated as a magic ranking factor. We use schema as a clarity layer." },
  { t: "seo", q: "Are meta titles and descriptions enough for SEO?", a: "No. Titles and descriptions matter but are only one part of the system. The visible content, headings, URL, internal links, structure, search intent and technical setup all need to communicate the same meaning; a good meta title can't fix a weak page." },
  { t: "seo", q: "Should every FAQ use FAQ schema?", a: "No. FAQ content should be written because it helps users make better decisions, not because it promises a search enhancement. Where structured data is appropriate it should describe visible content accurately, but the primary purpose of an FAQ is clarity, trust and objection handling." },
  { t: "seo", q: "Do Core Web Vitals matter for SEO?", a: "Yes, but they're not the whole strategy. Core Web Vitals measure loading performance, responsiveness and visual stability and support user experience and technical quality, but a fast page with weak content, unclear structure or poor search intent is still weak. Performance supports SEO; it doesn't replace strategy." },
  { t: "seo", q: "Is a high PageSpeed score enough?", a: "No. A strong score is useful but doesn't guarantee organic visibility or business results. Search performance also depends on relevance, content quality, page structure, internal linking, local signals, authority and the competitive landscape. Speed matters most when the page also has purpose." },
  { t: "seo", q: "What should SEO reporting include?", a: "It should explain what changed, why and what it means. Useful reporting may include indexed pages, search queries, impressions, clicks, page performance, technical issues, local visibility, service-page visibility and conversion paths. A report shouldn't hide behind charts; it should make the work understandable." },
  { t: "seo", q: "Is more traffic always better?", a: "No. More traffic is only useful if it brings the right visitors to the right pages. A business doesn't need random visibility; it needs relevant visibility that can turn into trust, contact, booking, enquiry or sale. The goal is qualified organic growth, not traffic for its own sake." },
  { t: "seo", q: "Why can SEO traffic increase without more leads?", a: "Because traffic and conversion are different problems. A page may attract visitors but fail to explain the offer, build trust, answer objections or guide users to the next step, which turns the SEO problem into a structure and conversion problem too. We connect SEO with page architecture, content clarity and business action." }
];

/* MRKX Assistant: discovery questions. After a service answer the bot asks 1-2 short questions to understand the visitor's
   situation, answers each one with a tailored line, then suggests the next step (free analysis or consultation).
   o.r = tailored reply; o.offer = optional next-step offer ("analysis" | "consult"). No prices or promises beyond the published ones. */
var MRKX_DISC = {
  website: [
    { id: "kind", short: "Website", q: "Quick question so I can point you the right way: is this a brand-new site, or are you improving one you already have?",
      opts: [
        { t: "A new site", r: "For a new site the best start is planning the structure first: which pages you need, what each one must achieve and how visitors move between them. Design comes after that." },
        { t: "Improve my current one", r: "Good to know. With an existing site we start by checking what works and what holds it back: structure, speed, technical SEO foundations and how forms and tracking behave. The free analysis does a first version of exactly that.", offer: "analysis" },
        { t: "Just exploring", r: "No pressure at all. It helps to know that a website project covers much more than design: structure, technical SEO, performance, accessibility, analytics and integrations." }
      ] },
    { id: "size", short: "Size", q: "And roughly how big do you expect it to be?",
      opts: [
        { t: "A few pages", r: "A small site works well when every page has a clear job. Each service usually still gets its own page, so it can be explained properly." },
        { t: "5-15 pages", r: "That's a typical business site: a homepage, separate service pages, about, contact and supporting pages like FAQ or case studies, planned as one structure." },
        { t: "Larger or multilingual", r: "For a larger or multilingual site the structure matters even more: localised URLs, language-specific metadata and reusable templates, planned before the design starts." },
        { t: "Not sure yet", r: "That's fine. Working out the right page structure is part of the first step, so we can shape it together." }
      ] }
  ],
  seo: [
    { id: "site", short: "Website", q: "To point you the right way: do you already have a website?",
      opts: [
        { t: "Yes, I have one", r: "Then the best first step is a look at what search engines actually see: crawling, indexing, page structure, metadata and local signals. The free analysis covers a first review of that.", offer: "analysis" },
        { t: "Not yet", r: "That's actually a good moment for SEO: if the structure and technical foundations are planned together with the site, you avoid fixing them later." }
      ] },
    { id: "market", short: "Customers", q: "And where are your customers?",
      opts: [
        { t: "Local, my town or region", r: "For a local business, local SEO matters: your Google Business Profile, clear service and location information, reviews and a website that reinforces the same details." },
        { t: "Across Iceland", r: "Then clear service pages that match what people search for, consistent business details and a solid technical foundation are the core." },
        { t: "Tourists or international", r: "Then language structure matters too: separate language versions with localised URLs and language-specific metadata, so search engines understand each version." },
        { t: "Not sure yet", r: "No problem. Who you want to reach decides how the pages and content are structured, so it's one of the first things we'd clarify together." }
      ] }
  ],
  landing: [
    { id: "traffic", short: "Traffic", q: "Quick question: where would the visitors come from?",
      opts: [
        { t: "Paid ads", r: "Then message match is critical: the page should feel like a direct continuation of the ad, and tracking should be planned before the campaign starts." },
        { t: "Email or social", r: "Then the page should continue the message that brought people there, with one clear next step and measurement that shows which source produces results." },
        { t: "Google search", r: "Then the page also needs a search strategy: content, indexing, internal linking and technical SEO, decided on purpose and not left to chance." },
        { t: "Not decided yet", r: "That's fine. The traffic source decides the message, so defining it is one of the first steps of the project." }
      ] },
    { id: "goal", short: "Action", q: "And what should a visitor do on the page?",
      opts: [
        { t: "Send an enquiry", r: "For enquiries the form is key: every field should have a purpose, errors should be handled and the message should reach the right person." },
        { t: "Book something", r: "For bookings the path matters: availability, confirmation and reminders should work reliably, and we can connect the page to your booking tool." },
        { t: "Buy or order", r: "For purchases, trust and clarity decide: a clear offer, visible proof and a payment flow that is tested end to end." },
        { t: "Sign up or download", r: "For sign-ups a short, focused form and a clear promise of what happens next usually work best." }
      ] }
  ],
  brand: [
    { id: "start", short: "Starting point", q: "To understand where you are: what do you have today?",
      opts: [
        { t: "Nothing yet", r: "Then you can build it properly from the start: positioning, colours, typography, tone of voice and rules, so every future asset follows the same system." },
        { t: "Just a logo", r: "That's common. A logo is one part of the identity, so the next step is defining how colours, type, layout and voice work together on your website, social media and documents." },
        { t: "An identity that feels inconsistent", r: "That's exactly what a brand system fixes: it gives every future decision a clear reference, so colours, fonts, layouts and tone stop drifting." }
      ] },
    { id: "use", short: "Use", q: "And where would it be used first?",
      opts: [
        { t: "Website", r: "Then the system should come with website and landing-page visual rules, accessible colour combinations and responsive typography." },
        { t: "Social media and ads", r: "Then templates and asset structure matter: how layouts, imagery and tone of voice are applied across posts and campaigns." },
        { t: "Everywhere", r: "Then it's worth building the full system with documentation and export-ready assets, so anyone working with your brand can apply it correctly." }
      ] }
  ],
  automation: [
    { id: "task", short: "Repeated task", q: "To understand what would help most: what do you repeat most often?",
      opts: [
        { t: "Handling enquiries and follow-up", r: "That's a classic: leads can be captured, categorised, stored in a CRM or spreadsheet, assigned and followed up, with a notification to the right person." },
        { t: "Onboarding new clients", r: "Onboarding is a good candidate: collecting information, creating folders, sending welcome emails, assigning tasks and scheduling can run as one consistent workflow." },
        { t: "Bookings", r: "Booking flows can handle confirmations, reminders and updates to calendars or spreadsheets, so nothing depends on someone remembering." },
        { t: "Reports and admin", r: "Reporting and repetitive admin often automate well: data synced between tools, reports prepared on a schedule, documents handled consistently." },
        { t: "Something else", r: "Tell me a bit more about it in your own words. The best automation candidates are usually things you repeat every day or every week." }
      ] },
    { id: "tools", short: "Tools", q: "And what do you use today?",
      opts: [
        { t: "Google Workspace", r: "That works well: Gmail, Sheets, Calendar and Forms can be connected into workflows without replacing what you already use." },
        { t: "A CRM", r: "Good: then the workflow can keep the CRM up to date automatically, with duplicate handling and notifications when something needs attention." },
        { t: "Spreadsheets and email", r: "That's very common, and a fine starting point. Before building anything we'd look at where the data should live and which steps can follow clear rules." },
        { t: "Not much yet", r: "Then the first step is simplifying the process, and automation comes after. We help decide what to automate, what to improve first and where a person should stay in the loop." }
      ] }
  ],
  app: [
    { id: "users", short: "Users", q: "To understand the idea: who would use the app?",
      opts: [
        { t: "My customers", r: "Then it has to earn its place on their phone: repeat use, accounts, notifications or offline access are the usual reasons an app beats a website." },
        { t: "My staff", r: "For internal use, an app is sometimes the right answer and sometimes a web tool or workflow fits better. We check the format first." },
        { t: "Both", r: "That usually means different roles and permissions, which is worth planning in the structure from the start." },
        { t: "Not sure yet", r: "That's a normal place to start. Defining who it's for is the first product decision." }
      ] },
    { id: "core", short: "Core action", q: "And what is the one thing it must do well?",
      opts: [
        { t: "Booking or scheduling", r: "A good core action to build around: availability, confirmations and reminders, with the first version kept focused." },
        { t: "Orders or payments", r: "Payments add privacy, security and store-review requirements, so we plan them from the beginning." },
        { t: "Accounts and content", r: "Accounts and personalised content point to a real app case, with authentication, data structure and permissions planned early." },
        { t: "I'm not sure yet", r: "Then it's worth defining it before any design: the first version should prove one core action, and everything else can come later.", offer: "consult" }
      ] }
  ]
};

/* MRKX Assistant: rule-based chat widget. No LLM, no external calls except the optional handoff endpoint.
   Replies in English; Icelandic: UI labels, greeting and handoff flow only (needs native proofreading). */
(function () {
  if (window.__mrkxChatLoaded) return;
  window.__mrkxChatLoaded = true;

  var KB = MRKX_KB;
  var CFG = {
    endpoint: null,          // Apps Script web app URL; null = demo mode (nothing is sent)
    demoResult: "ok",        // demo mode: "ok" | "cap" | "duplicate" | "network"
    fast: false,             // no typing delays (tests)
    email: "hello@mrkxlabs.com",
    phone: "+354 837 8339",
    storageKey: "mrkx_chat_v1",
    maxMessages: 80,
    maxLen: 500,
    noConsentGate: false     // tests: skip waiting for the cookie banner
  };
  var user = window.MRKX_CHAT_CONFIG || {};
  for (var k in user) if (Object.prototype.hasOwnProperty.call(user, k)) CFG[k] = user[k];

  var PAGE_IS = /^\/is(\/|$)/.test(location.pathname);

  /* ---------- strings ---------- */
  var STR = {
    en: {
      title: "MRKX Assistant", sub: "Automated assistant", ph: "Type your message…", send: "Send",
      open: "Open chat", close: "Close chat", renew: "New conversation", renewQ: "Start a new conversation? This clears the current one.", renewYes: "Start over", renewNo: "Keep chatting", note: "Automated assistant. Your messages are only sent to our team if you ask us to.",
      welcome: "Hi! I'm MRKX Assistant, an automated assistant for MRKX Labs (not a person). I can explain our services, answer questions and set up a free website and search analysis.",
      askEmail: "What email address should we reply to?",
      badEmail: "That doesn't look like an email address. Could you check it?",
      askName: "And your name? (You can skip this.)",
      askNote: "Anything you'd like us to know before we reply? (You can skip this.)",
      askUrl: "Great. What's the address of your website?",
      badUrl: "That doesn't look like a web address. It should look like example.is or www.example.com.",
      noSite: "No problem. Without a website, a short consultation fits better. Shall I pass your request to the team?",
      askCompany: "And your company or business name? (You can skip this.)",
      consentAnalysis: "To prepare your analysis we'll email you at {email}, and our team will see this conversation. We offer one free analysis per company. Is that OK?",
      consentHandoff: "We'll email you at {email}, and our team will receive this conversation so they can reply properly. Is that OK?",
      agree: "Yes, that's OK", cancel: "Cancel", skip: "Skip",
      sentAnalysis: "Thank you. Your request is in. You'll get the analysis as a PDF by email within 48 hours.",
      sentHandoff: "Thank you. We've sent your message to the team. They'll reply to you by email as soon as they can.",
      cap: "We've reached today's limit for free analyses. Please come back tomorrow, or email us at {mail} and we'll reply as soon as we can.",
      dup: "It looks like we've already received an analysis request for this website. Each company gets one free analysis, but I can pass your message to the team so they can follow up. Shall I do that?",
      err: "Sorry, that didn't go through. Please email us at {mail} and we'll take it from there.",
      cancelled: "No problem, I haven't sent anything. What else can I help you with?",
      declined: "No problem. Ask me anything else, or just have a look around.",
      sentOnce: "We've already sent a request from this chat. If you need to add something, please email us at {mail}.",
      tooMany: "We've talked quite a lot. For anything further, please email us at {mail} and we'll follow up personally.",
      sensitive: "Please don't share card numbers, passwords or personal ID numbers here. I haven't saved that message. If you need to share something confidential, email us at {mail}.",
      isNote: "Thanks for your message! I can't answer in detail in Icelandic yet. I can answer in English, or pass your question to our team.",
      thanksName: "Nice to meet you, {name}.",
      askHandoff: "Of course. I can send this conversation to our team by email and they'll reply to you. Shall I do that?",
      yes: "Yes, please", notNow: "Not now",
      moreNone: "What would you like to know more about? Our services, prices, process or the free analysis?",
      qBiz: "By the way, what kind of business is this for? It helps me give you more relevant answers.",
      qGoal: "And what's the main goal: more enquiries, more online sales, a clearer site or being found on Google?",
      qTiming: "Do you have a rough timing in mind?",
      qThanks: "Thanks, noted.",
      offerAnalysis: "If you already have a website, I can set up a free website and search analysis for you. Want that?",
      reAsk: "Back to your request:"
    },
    is: {
      title: "MRKX aðstoðarmaður", sub: "Sjálfvirkur aðstoðarmaður", ph: "Skrifaðu skilaboð…", send: "Senda",
      open: "Opna spjall", close: "Loka spjalli", renew: "Nýtt spjall", renewQ: "Byrja nýtt spjall? Þetta eyðir núverandi spjalli.", renewYes: "Byrja upp á nýtt", renewNo: "Halda áfram", note: "Sjálfvirkur aðstoðarmaður. Skilaboðin þín eru aðeins send til teymisins ef þú biður um það.",
      welcome: "Halló! Ég er sjálfvirkur aðstoðarmaður MRKX Labs og svara sem stendur á ensku, en get sent spurninguna þína áfram til teymisins. Hvað get ég gert fyrir þig?",
      askEmail: "Á hvaða netfang eigum við að svara?",
      badEmail: "Þetta lítur ekki út eins og netfang. Geturðu athugað það?",
      askName: "Og hvað heitir þú? (Þú getur sleppt þessu.)",
      askNote: "Er eitthvað sem þú vilt að við vitum áður en við svörum? (Þú getur sleppt þessu.)",
      askUrl: "Frábært. Hver er slóðin á vefsíðuna þína?",
      badUrl: "Þetta lítur ekki út eins og vefslóð. Hún ætti að líta út eins og example.is eða www.example.com.",
      noSite: "Ekkert mál. Ef þú ert ekki með vefsíðu hentar stutt ráðgjöf betur. Á ég að senda beiðnina til teymisins?",
      askCompany: "Og hvað heitir fyrirtækið þitt? (Þú getur sleppt þessu.)",
      consentAnalysis: "Til að undirbúa greininguna sendum við þér tölvupóst á {email} og teymið okkar fær þetta samtal. Hvert fyrirtæki fær eina ókeypis greiningu. Er það í lagi?",
      consentHandoff: "Við sendum þér tölvupóst á {email} og teymið okkar fær þetta samtal svo það geti svarað þér almennilega. Er það í lagi?",
      agree: "Já, það er í lagi", cancel: "Hætta við", skip: "Sleppa",
      sentAnalysis: "Takk fyrir. Beiðnin þín er komin. Þú færð greininguna sem PDF í tölvupósti innan 48 klukkustunda.",
      sentHandoff: "Takk fyrir. Skilaboðin þín hafa verið send til teymisins. Það svarar þér með tölvupósti eins fljótt og hægt er.",
      cap: "Við erum búin að ná dagsmarkinu fyrir ókeypis greiningar. Komdu aftur á morgun eða sendu okkur tölvupóst á {mail} og við svörum eins fljótt og við getum.",
      dup: "Svo virðist sem við höfum þegar fengið beiðni um greiningu fyrir þessa vefsíðu. Hvert fyrirtæki fær eina ókeypis greiningu, en ég get sent skilaboðin þín til teymisins svo það geti haft samband. Á ég að gera það?",
      err: "Því miður tókst þetta ekki. Sendu okkur tölvupóst á {mail} og við tökum við þaðan.",
      cancelled: "Ekkert mál, ég hef ekkert sent. Hvað annað get ég gert fyrir þig?",
      declined: "Ekkert mál. Spyrðu mig um hvað sem er eða líttu í kringum þig.",
      sentOnce: "Við höfum þegar sent beiðni úr þessu spjalli. Ef þú vilt bæta einhverju við, sendu okkur þá tölvupóst á {mail}.",
      tooMany: "Við höfum talað töluvert saman. Sendu okkur tölvupóst á {mail} og við fylgjum þessu eftir persónulega.",
      sensitive: "Vinsamlegast ekki senda kortanúmer, lykilorð eða kennitölur hér. Ég hef ekki vistað þessi skilaboð. Ef þú þarft að deila trúnaðarupplýsingum, sendu okkur þá tölvupóst á {mail}.",
      askHandoff: "Að sjálfsögðu. Ég get sent þetta samtal til teymisins okkar í tölvupósti og það svarar þér. Á ég að gera það?",
      yes: "Já, endilega", notNow: "Ekki núna",
      isNote: "Takk fyrir skilaboðin! Ég get ekki svarað ítarlega á íslensku ennþá. Ég get svarað á ensku eða sent spurninguna þína áfram til teymisins.",
      reAsk: "Aftur að beiðninni þinni:"
    }
  };

  /* ---------- state ---------- */
  var S = fresh();
  function fresh() {
    return { lang: PAGE_IS ? "is" : "en", hist: [], slots: {}, topic: null, last: null, lastMore: null, pending: null,
             flow: null, fails: 0, subst: 0, asked: {}, awaiting: null, offeredAnalysis: false, msgs: 0,
             t0: Date.now(), sent: false, greeted: false, variant: {}, open: false };
  }
  function T(key, vars) {
    var s = (STR[S.lang] && STR[S.lang][key]) || STR.en[key] || key;
    if (vars) for (var v in vars) s = s.split("{" + v + "}").join(vars[v]);
    return s.split("{mail}").join(CFG.email);
  }
  function save() { try { sessionStorage.setItem(CFG.storageKey, JSON.stringify(S)); } catch (e) {} }
  function load() {
    try { var raw = sessionStorage.getItem(CFG.storageKey); if (raw) { var o = JSON.parse(raw); if (o && o.hist) { S = o; S.sending = false; } } } catch (e) {}
  }

  /* ---------- text helpers ---------- */
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function stem(w) {
    if (w.length <= 3) return w;
    if (w.charAt(w.length - 1) === "s" && w.charAt(w.length - 2) !== "s") w = w.slice(0, -1);
    if (w.length > 4 && w.slice(-3) === "ing") w = w.slice(0, -3);
    else if (w.length > 4 && w.slice(-2) === "ed") w = w.slice(0, -2);
    if (w.length > 3 && w.charAt(w.length - 1) === "e") w = w.slice(0, -1);
    return w;
  }
  function toks(s) {
    return norm(s).replace(/[^a-z0-9#]+/g, " ").trim().split(" ").filter(Boolean).map(stem);
  }
  function hasSeq(M, P) {
    if (!P.length) return false;
    for (var i = 0; i + P.length <= M.length; i++) {
      var ok = true;
      for (var j = 0; j < P.length; j++) if (M[i + j] !== P[j]) { ok = false; break; }
      if (ok) return true;
    }
    return false;
  }
  var KIND_RANK = { rule: 4, faq: 3, question: 2, topic: 1 };
  var SHORT_ONLY = { greet: 1, thanks: 1, bye: 1 };

  // pre-tokenise patterns once
  KB.intents.forEach(function (it) {
    it._p = it.kw.map(function (p) { var t = toks(p); return { t: t, w: t.length === 1 ? 1.5 : Math.min(2 + 0.5 * (t.length - 2), 3.5) }; });
  });

  function scoreAll(M) {
    var out = [];
    KB.intents.forEach(function (it) {
      if (SHORT_ONLY[it.id] && M.length > 5) return;
      var sc = 0;
      it._p.forEach(function (p) { if (hasSeq(M, p.t)) sc += p.w; });
      if (sc > 0) out.push({ it: it, sc: sc });
    });
    out.sort(function (a, b) {
      if (Math.abs(b.sc - a.sc) > 0.01) return b.sc - a.sc;
      return (KIND_RANK[b.it.kind] || 0) - (KIND_RANK[a.it.kind] || 0);
    });
    return out;
  }
  /* ---------- discovery questions ---------- */
  var DISC = (typeof MRKX_DISC !== "undefined") ? MRKX_DISC : {};
  function discState() { S.disc = S.disc || { asked: {}, ans: {}, skips: 0, tick: 0, last: -9 }; return S.disc; }
  function nextDisc(topic) {
    var qs = DISC[topic], ds = discState();
    if (!qs || S.pending || S.flow || S.awaiting || ds.skips >= 2 || (S.ignored || 0) >= 2) return null;
    if (ds.tick - ds.last < 2) return null;
    for (var i = 0; i < qs.length; i++) if (!ds.asked[topic + ":" + qs[i].id]) return qs[i];
    return null;
  }
  function askDisc(topic, q) {
    var ds = discState(); ds.asked[topic + ":" + q.id] = 1; ds.last = ds.tick;
    S.awaiting = "disc:" + topic + ":" + q.id;
    var chips = q.opts.map(function (o, i) { return { t: o.t, go: "d:" + topic + ":" + q.id + ":" + i }; });
    chips.push({ t: "Skip", go: "d:skip" });
    save();
    return say(q.q, chips);
  }
  function discAfter(p, topic) {
    var ds = discState(); ds.tick++;
    var q = nextDisc(topic);
    if (!q) return p;
    return Promise.resolve(p).then(function () { return askDisc(topic, q); });
  }
  function discAnswer(topic, qid, idx, free) {
    var ds = discState(), qs = DISC[topic] || [], q = null;
    qs.forEach(function (x) { if (x.id === qid) q = x; });
    S.awaiting = null;
    if (!q) return say(T("declined"));
    var o = (idx !== null && idx !== undefined) ? q.opts[idx] : null;
    var label = o ? o.t : String(free || "").slice(0, 100);
    ds.ans[topic + ":" + qid] = label;
    S.slots.details = ((S.slots.details ? S.slots.details + "; " : "") + q.short + ": " + label).slice(0, 300);
    if (o && o.offer === "analysis" && !S.sent) S.slots.hasSite = 1;
    var reply = o ? o.r : "Thanks, noted: " + label.slice(0, 60) + ".";
    var left = qs.filter(function (x) { return !ds.asked[topic + ":" + x.id]; });
    S.topic = topic; S.last = "disc";
    var p;
    if (left.length) {
      p = say(reply);
      ds.last = ds.tick - 2;
      return Promise.resolve(p).then(function () { return askDisc(topic, left[0]); });
    }
    // last question of the topic answered: suggest a next step
    var offerA = (o && o.offer === "analysis") || S.slots.hasSite;
    var wantsAnalysis = offerA && !S.offeredAnalysis && !S.sent;
    var closing;
    if (wantsAnalysis) { S.offeredAnalysis = true; S.pending = "analysis"; closing = reply + "\n\nShall I set up the free website and search analysis for you?"; save(); return say(closing, [{ t: "Yes, set it up", go: "analysis_start" }, { t: "What's in it?", go: "analysis_detail" }, { t: "Not now", go: "decline" }]); }
    S.pending = "consult";
    closing = reply + "\n\nThanks, that gives me a good picture. A short consultation is the quickest way to shape the scope and the price around your project. Would you like me to pass your details to the team?";
    save();
    return say(closing, [{ t: "Yes, please", go: "handoff_start_consult" }, { t: "More detail", go: "sec:" + topic }, { t: "Not now", go: "decline" }]);
  }

  /* ---------- detailed service sections ---------- */
  var SEC = (typeof MRKX_SECTIONS !== "undefined") ? MRKX_SECTIONS : {};
  var RT_MIN = 0.34, RT_FAQ = 0.5;
  var DETAIL_CUE = /\b(detail|details|detailed|in depth|in-depth|elaborate|explain|full description|more about|more info|more information|everything about|deep dive|tell me everything)\b/i;
  Object.keys(SEC).forEach(function (k) {
    SEC[k].items.forEach(function (x) { x._p = x.kw.map(function (p) { var t = toks(p); return { t: t, w: t.length === 1 ? 1.5 : Math.min(2 + 0.5 * (t.length - 2), 3.5) }; }); });
  });
  function bestSection(M, msgTopic) {
    var out = null;
    Object.keys(SEC).forEach(function (k) {
      if (k !== msgTopic && k !== S.topic) return;
      SEC[k].items.forEach(function (x, i) {
        var sc = 0;
        x._p.forEach(function (p) { if (hasSeq(M, p.t)) sc += p.w; });
        if (k === msgTopic) sc += sc ? 0.3 : 0;
        if (sc > 0 && (!out || sc > out.sc)) out = { key: k, idx: i, sc: sc };
      });
    });
    return out;
  }
  var SUMMARY = {
    website: "A professional website is a complete digital system, not a brochure: structure, design, development, technical SEO foundations, performance, accessibility, analytics, integrations and long-term maintainability. Business Website projects start from " + KB.priceWeb + " plus VAT.",
    seo: "We treat SEO as search infrastructure, not a ranking trick: technical foundation, page architecture, clear content, local relevance, structured data and measurement. We don't sell ranking promises. Search Foundation work starts from " + KB.priceSeo + " plus VAT.",
    landing: "A landing page is built for one audience, one offer and one next step, with the message, proof, form and tracking planned together instead of the design first. Landing pages are priced per project.",
    brand: "A brand system is more than a logo: it defines how a business looks, communicates and stays consistent across its website, social media, ads and future digital products. It's priced per project.",
    automation: "We design automation as reliable workflow systems that start from your process, not from a tool: leads, CRM, onboarding, notifications and reporting, with error handling and human control where it matters. It's priced per project.",
    app: "We treat a mobile app as a product system, not just screens: first we check whether an app is the right solution, then plan the core action, architecture, performance, privacy and store launch. App projects start from " + KB.priceApp + " plus VAT."
  };
  /* ---------- phone: long answers are split into a short first bubble + "Tell me more" ---------- */
  function splitPhone(text) {
    var isPhone = false;
    try { isPhone = !!(window.matchMedia && window.matchMedia(PHONE_Q).matches); } catch (e) {}
    S.cont = null;
    if (!isPhone || text.length < 380) return { head: text, chip: null };
    var parts = text.split(/(?<=[.!?])\s+(?=[A-Z0-9\[])/), head = "", i = 0;
    while (i < parts.length - 1 && (i < 2 || head.length < 150) && head.length + parts[i].length < 330) { head += (head ? " " : "") + parts[i]; i++; }
    var rest = parts.slice(i).join(" ");
    if (!head || rest.length < 120) return { head: text, chip: null };
    S.cont = rest; S.keepCont = 1;
    return { head: head, chip: { t: "Tell me more", go: "cont" } };
  }
  function contAnswer(prefix) {
    var t = S.cont; S.cont = null; S.keepCont = 0;
    var chips = [];
    if (S.topic && SEC[S.topic]) { var seen = (S.secSeen && S.secSeen[S.topic]) || [], n = SEC[S.topic].items.length; for (var j = 0; j < n && chips.length < 1; j++) if (seen.indexOf(j) < 0) chips.push({ t: SEC[S.topic].items[j].t, go: "sec:" + S.topic + ":" + j }); chips.push({ t: "All topics", go: "sec:" + S.topic }); }
    chips.push({ t: "Book a consultation", go: "consultation" });
    S.last = "sec";
    return finish((prefix || "") + t, chips, null, true);
  }
  function secOverview(key, prefix) {
    var d = SEC[key]; S.topic = key; S.lastMore = null;
    var names = d.items.map(function (x) { return x.t; });
    var chips = d.items.slice(0, 8).map(function (x, i) { return { t: x.t, go: "sec:" + key + ":" + i }; });
    chips.push({ t: "Pricing", go: "pricing" });
    var text = (prefix || "") + (SUMMARY[key] || d.intro) + "\n\nI can go into detail on: " + names.join(", ") + ". Tap a topic below, or just type your question. [" + d.name.charAt(0).toUpperCase() + d.name.slice(1) + " service](" + pathLink(d.url) + ")";
    S.last = "sec";
    return finish(text, chips, null, true);
  }
  function secAnswer(key, idx, prefix) {
    var d = SEC[key], x = d.items[idx]; S.topic = key; S.lastMore = null;
    S.secSeen = S.secSeen || {}; (S.secSeen[key] = S.secSeen[key] || []);
    if (S.secSeen[key].indexOf(idx) < 0) S.secSeen[key].push(idx);
    var chips = [], n = d.items.length, seen = S.secSeen[key];
    for (var s = 1; s < n && chips.length < 2; s++) { var j = (idx + s) % n; if (seen.indexOf(j) < 0) chips.push({ t: d.items[j].t, go: "sec:" + key + ":" + j }); }
    chips.push({ t: "All topics", go: "sec:" + key });
    chips.push({ t: "Book a consultation", go: "consultation" });
    S.last = "sec";
    var t0 = (prefix || "") + x.a.replace(/\]\((\/[^)]*)\)/g, function (m, u) { return "](" + pathLink(u) + ")"; });
    var sp = splitPhone(t0); if (sp.chip) chips.unshift(sp.chip);
    return sp.chip ? finish(sp.head, chips, null, true) : discAfter(finish(sp.head, chips, null, true), key);
  }
  function secNext(key, prefix) {
    var d = SEC[key], seen = (S.secSeen && S.secSeen[key]) || [];
    for (var i = 0; i < d.items.length; i++) if (seen.indexOf(i) < 0) return secAnswer(key, i, prefix);
    return secOverview(key, prefix);
  }

  /* ---------- free-text retrieval over the FAQ and the service sections ---------- */
  var STOP = {}; "a an the and or of to in on for with is are was be can could do does did how what why when where which who whom i you we it my your our me us this that these those there here at by from as about into than then so if not no yes any some more most much many very just also please tell give want need like would should will have has had get got let know".split(" ").forEach(function (w) { STOP[w] = 1; });
  var DOCS = [];
  (typeof MRKX_FAQ !== "undefined" ? MRKX_FAQ : []).forEach(function (f) { DOCS.push({ kind: "faq", topic: f.t, title: f.q, text: f.a, hi: f.q, lo: f.a }); });
  Object.keys(SEC).forEach(function (k) { SEC[k].items.forEach(function (x, i) { DOCS.push({ kind: "sec", topic: k, idx: i, title: x.t, text: x.a, hi: x.t, mid: x.kw.join(" "), lo: x.a }); }); });
  function content(s) { return toks(s).filter(function (t) { return t.length > 1 && !STOP[t]; }); }
  var DF = {};
  DOCS.forEach(function (d) {
    d.th = {}; d.tl = {}; d.tm = {};
    content(d.hi).forEach(function (t) { d.th[t] = 1; });
    content(d.mid || "").forEach(function (t) { d.tm[t] = 1; });
    content(d.lo).forEach(function (t) { d.tl[t] = 1; });
    Object.keys(d.th).concat(Object.keys(d.tm), Object.keys(d.tl)).filter(function (t, i, a) { return a.indexOf(t) === i; }).forEach(function (t) { DF[t] = (DF[t] || 0) + 1; });
  });
  function idf(t) { return Math.log(1 + DOCS.length / (DF[t] || 0.5)); }
  function retrieve(raw, msgTopic) {
    var q = content(raw).filter(function (t, i, a) { return a.indexOf(t) === i; });
    if (!q.length) return null;
    var best = null, second = 0, total = 0;
    q.forEach(function (t) { total += idf(t) * 3; });
    DOCS.forEach(function (d) {
      var sc = 0, mt = 0;
      q.forEach(function (t) { if (d.th[t] || d.tm[t] || d.tl[t]) mt++; if (d.th[t]) sc += idf(t) * 3; else if (d.tm[t]) sc += idf(t) * 1.6; else if (d.tl[t]) sc += idf(t); });
      if (!sc) return;
      var bias = (d.topic === msgTopic || (!msgTopic && d.topic === S.topic)) ? 1.35 : ((msgTopic && d.topic !== msgTopic) ? 0.6 : 1);
      sc = sc * bias / total;
      if (!best || sc > best.sc) { second = best ? best.sc : 0; best = { d: d, sc: sc, mt: mt }; } else if (sc > second) second = sc;
    });
    if (best) best.second = second;
    return best;
  }
  function docAnswer(d, prefix) {
    S.topic = d.topic; S.lastMore = null;
    var i = DOCS.indexOf(d);
    var related = DOCS.filter(function (x) { return x !== d && x.topic === d.topic && x.kind === "faq"; });
    // related = the 2 FAQ questions that share most terms with this one
    var mine = Object.keys(d.th).concat(Object.keys(d.tl));
    related.sort(function (a, b) { return overlap(b, mine) - overlap(a, mine); });
    var chips = related.slice(0, 2).map(function (x) { var t = x.title.replace(/\?$/, ""); return { t: t.length > 38 ? t.slice(0, 36).replace(/\s+\S*$/, "") + "..." : t, go: "doc:" + DOCS.indexOf(x) }; });
    chips.push({ t: "All " + SEC[d.topic].name + " topics", go: "sec:" + d.topic });
    chips.push({ t: "Book a consultation", go: "consultation" });
    var text = (prefix || "") + d.text.replace(/\]\((\/[^)]*)\)/g, function (m, u) { return "](" + pathLink(u) + ")"; });
    if (d.kind === "faq") text += " [" + SEC[d.topic].name.charAt(0).toUpperCase() + SEC[d.topic].name.slice(1) + " service](" + pathLink(SEC[d.topic].url) + ")";
    if (d.kind === "sec") { S.secSeen = S.secSeen || {}; (S.secSeen[d.topic] = S.secSeen[d.topic] || []); if (S.secSeen[d.topic].indexOf(d.idx) < 0) S.secSeen[d.topic].push(d.idx); }
    S.last = "sec";
    var sp2 = splitPhone(text); if (sp2.chip) chips.unshift(sp2.chip);
    return sp2.chip ? finish(sp2.head, chips, null, false) : discAfter(finish(sp2.head, chips, null, false), d.topic);
  }
  function overlap(d, mine) { var n = 0; mine.forEach(function (t) { if (d.th[t] || d.tl[t] || d.tm[t]) n += idf(t); }); return n; }

  function topicOf(M) {
    var best = null, bs = 0;
    KB.intents.forEach(function (it) {
      if (it.kind !== "topic") return;
      var sc = 0;
      it._p.forEach(function (p) { if (hasSeq(M, p.t)) sc += p.w; });
      if (sc > bs) { bs = sc; best = it.topic; }
    });
    return best;
  }

  function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim()); }
  function findEmail(s) { var m = s.match(/[^\s@,;<>]+@[^\s@,;<>]+\.[a-z]{2,}/i); return m ? m[0] : null; }
  function normUrl(s) {
    var t = s.trim().replace(/^<|>$/g, "");
    var m = t.match(/((?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:\/\S*)?)/i);
    if (!m) return null;
    var u = m[1];
    if (/@/.test(t) && !/^https?:\/\//i.test(u) && t.indexOf("@") < t.indexOf(u)) return null;
    return /^https?:\/\//i.test(u) ? u : "https://" + u;
  }
  function domainOf(u) { try { return new URL(u).hostname.replace(/^www\./, "").toLowerCase(); } catch (e) { return u; } }
  function sensitive(raw) {
    if (/\b(?:\d[ -]?){13,19}\b/.test(raw)) return true;
    if (/\b\d{6}-?\d{4}\b/.test(raw)) return true;
    return /(password|passwd|cvv|cvc|pin code|passport number|social security|lykilorð|lykilord)/i.test(raw);
  }
  var IS_STRONG = ["takk", "hallo", "halló", "teymisins", "senda", "svara", "spurningu", "ensku", "íslensku", "vinsamlegast", "netfang", "hvernig", "vefsíða", "vefsíðu", "heimasíða", "fyrirtæki", "verð", "góðan", "daginn", "sæl", "sæll", "viltu", "vantar", "þjónusta", "þarf"];
  var IS_WEAK = [" og ", " ég ", " að ", " ekki ", " það ", " hvað ", " er ", " við ", " mig ", " vil ", " get ", " hefur ", " fyrir "];
  function isIcelandic(raw) {
    var s = " " + raw.toLowerCase() + " ";
    if (/[þðæ]/.test(s)) return true;
    var strong = 0, weak = 0;
    IS_STRONG.forEach(function (w) { if (s.indexOf(w) > -1) strong++; });
    IS_WEAK.forEach(function (w) { if (s.indexOf(w) > -1) weak++; });
    return strong >= 1 || weak >= 4;
  }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function pathLink(p) { return PAGE_IS ? (p === "/" ? "/is" : "/is" + p) : p; }
  function fmt(text) {
    var h = esc(text);
    h = h.replace(/\[([^\]]+)\]\((\/[^)]*|https?:[^)]*)\)/g, function (m, label, url) {
      var href = url.charAt(0) === "/" ? pathLink(url) : url;
      return '<a href="' + href + '">' + label + "</a>";
    });
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return h.replace(/\n/g, "<br>");
  }
  function plain(text) { return text.replace(/\[([^\]]+)\]\((\/[^)]*|https?:[^)]*)\)/g, function (m, l, u) { return l + " (" + (u.charAt(0) === "/" ? "https://www.mrkxlabs.com" + pathLink(u) : u) + ")"; }).replace(/\*\*/g, ""); }
  function pick(arr, key) {
    if (arr.length === 1) return arr[0];
    var last = S.variant[key], i;
    do { i = Math.floor(Math.random() * arr.length); } while (i === last && arr.length > 1);
    S.variant[key] = i;
    return arr[i];
  }
  function byId(id) { for (var i = 0; i < KB.intents.length; i++) if (KB.intents[i].id === id) return KB.intents[i]; return null; }

  /* ---------- UI ---------- */
  var host, root, elPanel, elLauncher, elLog, elInput, elForm, elChips;
  var Q = Promise.resolve();

  /* Phone layout: narrow screens, and touch phones held sideways (short height). */
  var PHONE_Q = "(max-width:520px),(max-height:520px) and (orientation:landscape) and (pointer:coarse)";

  var CSS = [
    ":host{all:initial}",
    "*{box-sizing:border-box;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}",
    ".launcher{position:fixed;right:var(--lr,20px);bottom:var(--lb,20px);width:var(--ls,58px);height:var(--ls,58px);border-radius:50%;border:1px solid rgba(96,165,250,.55);background:linear-gradient(180deg,rgba(96,165,250,.55),rgba(37,99,235,.35));color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 10px 30px rgba(0,0,0,.4),0 0 0 4px rgba(96,165,250,.12);-webkit-backdrop-filter:blur(18px) saturate(140%);backdrop-filter:blur(18px) saturate(140%);z-index:2147483647;transition:transform .15s ease,background .15s ease}",
    ".launcher:hover{background:linear-gradient(180deg,rgba(96,165,250,.7),rgba(37,99,235,.5));transform:translateY(-1px)}",
    ".launcher:focus-visible,.chip:focus-visible,.send:focus-visible,.x:focus-visible,textarea:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}",
    ".launcher svg{width:45%;height:45%}",
    ".panel{position:fixed;right:var(--lr,20px);bottom:calc(var(--lb,20px) + 70px);width:380px;max-width:calc(100vw - 24px);height:min(600px,calc(100vh - 120px));display:none;flex-direction:column;background:linear-gradient(180deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,.08) 45%,rgba(255,255,255,.05) 100%),rgba(10,15,31,.55);color:#e5e7eb;border:1px solid rgba(255,255,255,.22);border-top-color:rgba(96,165,250,.6);border-radius:18px;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 18px 56px rgba(0,0,0,.5);-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%);overflow:hidden;z-index:2147483647}",
    ".panel.open{display:flex}",
    ".head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.14)}",
    ".dot{width:9px;height:9px;border-radius:50%;background:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.28)}",
    ".ht{flex:1;min-width:0}.ht b{display:block;font-size:13px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:#fff}.ht span{display:block;font-size:12px;color:#9ca3af;margin-top:2px}",
    ".nw{background:none;border:0;color:#cfd6ee;cursor:pointer;padding:6px 8px;border-radius:8px;display:flex}.nw:hover{background:rgba(255,255,255,.08)}",
    ".cf{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 16px;background:rgba(96,165,250,.14);border-bottom:1px solid rgba(255,255,255,.14);font-size:13px}.cf[hidden]{display:none}.cf span{flex:1 1 100%}.cf button{border-radius:100px;padding:6px 14px;font-size:13px;cursor:pointer;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#e5e7eb}.cf .cy{background:#fff;color:#323232}",
    ".nw:focus-visible,.cf button:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}",
    ".x{background:none;border:0;color:#cfd6ee;font-size:22px;line-height:1;cursor:pointer;padding:4px 8px;border-radius:8px}.x:hover{background:rgba(255,255,255,.08)}",
    ".log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}",
    ".m{max-width:86%;padding:10px 13px;border-radius:14px;font-size:14.5px;line-height:1.45;word-wrap:break-word;overflow-wrap:anywhere}",
    ".m a{color:#93c5fd;text-decoration:underline}",
    ".b{align-self:flex-start;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.18);border-bottom-left-radius:4px}",
    ".u{align-self:flex-end;background:linear-gradient(180deg,rgba(96,165,250,.6),rgba(37,99,235,.55));border:1px solid rgba(147,197,253,.5);color:#fff;border-bottom-right-radius:4px}",
    ".typing{align-self:flex-start;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:12px 14px;display:flex;gap:5px}",
    ".typing i{width:6px;height:6px;border-radius:50%;background:#9ca3af;animation:bl 1.1s infinite}.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}",
    "@keyframes bl{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}",
    ".chips{display:flex;flex-wrap:wrap;gap:7px;padding:2px 16px 10px}",
    ".chip{background:transparent;color:#dfe6ff;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.06);border-radius:100px;padding:7px 13px;font-size:13px;cursor:pointer;transition:background .12s}",
    ".chip:hover{background:rgba(96,165,250,.22);border-color:rgba(96,165,250,.7)}",
    "form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.18);align-items:flex-end}",
    "textarea{flex:1;resize:none;height:42px;max-height:110px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:#fff;padding:10px 12px;font-size:14.5px;line-height:1.3}",
    "textarea::placeholder{color:#9ca3af}",
    ".send{height:42px;border:1px solid rgba(147,197,253,.5);border-radius:24px;background:#fff;color:#323232;padding:0 18px;font-size:14px;cursor:pointer}.send:hover{opacity:.88}",
    ".note{font-size:11px;color:#9ca3af;text-align:center;padding:2px 14px 9px;background:rgba(0,0,0,.18)}",
    "@media " + PHONE_Q + "{textarea{font-size:16px}",
    ".panel{left:0;right:0;top:0;bottom:0;width:auto;max-width:none;height:100vh;height:100dvh;border-radius:0;border-left:0;border-right:0;border-top:0}",
    ".head{padding:10px 14px;padding-top:max(10px,env(safe-area-inset-top,0px))}",
    ".log{padding:12px 12px 8px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}.m{max-width:88%;font-size:15px}",
    ".chips{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:4px 12px 10px}.chips::-webkit-scrollbar{display:none}.chip{flex:0 0 auto;white-space:nowrap}",
    "form{padding:8px 10px;padding-bottom:max(8px,env(safe-area-inset-bottom,0px))}",
    ".panel.kb .note{display:none}.note{padding-bottom:max(9px,env(safe-area-inset-bottom,0px))}.panel.kb form{padding-bottom:8px}",
    ".launcher{right:var(--lr,14px);bottom:var(--lb,14px)}",
    ".head{gap:12px;padding-bottom:10px;background:rgba(255,255,255,.07)}",
    ".dot{width:38px;height:38px;border-radius:50%;background:linear-gradient(160deg,rgba(147,197,253,.95),rgba(37,99,235,.9));box-shadow:0 0 0 2px rgba(255,255,255,.18),0 4px 14px rgba(37,99,235,.45);display:flex;align-items:center;justify-content:center;position:relative;flex:0 0 auto}",
    ".dot:after{content:'';width:22px;height:14px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAA7CAYAAACE0Y8MAAAIY0lEQVR42u2cW6xdVRWGv7H26U0QRLRiKylovKBoWuulQkxKoiZCiMEEjViNeItUA0UKTdSEkJRr1QZJeVAgwQclXgKGeCGRYAkmxJf2QW0ClIgV21JpyzHU9nD2+n04Y+ZMVs6+zLnW2puQPZOV3XPO3nPPNcb/j3/MMeaqMcYhyQADpoDHgfcAM/67EpC/LnSFvwH8F1hvZockmZmphXUCFMD9wNlA13/G10vl3/1+J6ADPMOYHdDx1ys1N7rKHxt9rqkW13m5mh3/tDEaP6BnObAHOCVCGRFSBo3SP/M3YDVQNsmAiKUn+zrP8HXl2C5mgAF7izESwMysBG4EXueLKhZY8KCr4589F7jAzBQQ29AofJ1bgBVR+Cgyrurai3GHng952JmVVNag8kv++ut4/iZYKskknS3pRV9r2UDoCXOMjwFO7e09hCx1BBZcKOmtZtaNQlxdlgq4CXhNjdDTc/5iHOg3sy6wATjPs4m6iDWfZynw5QW0JHudks4HPtvQOnuKwqjTzte6aK7oEftzRhDjfwHvAo45hFUjTJbAn4GPNOyAwKR/jJoBQdC+C6yMjNbI3G6ktwCfcsN3Mo0/5Sz9XAvGf3mIG3HaKeCdwG5gUZQNNDWCoR4zs49KCg7PYeky4K/AqgZZWmXAM6NkQBC07wNLWhC0WIzPl7TWzMqMjCg47WrgrIZZOh4RjgTtIuCiFikdWGDANzJZWkpaCVzXsvFH4wCntCQtAX7QEvKrLAC4VNJyd7wlsnSrJwptr3UkDOg4pa/y+J+CKg1ZjqhmdrPAqcDnK04ZhqUfAL5QKbYNu9ZXlghHwrsC+LvXU4z209/g5D3A+4DuoHQ0csAjwPqWw2Rg1rNtMyBQ+mYvtg1L6YD8Q8DRDIQV7oRzgI8Nqg9Fxv90hvHDul5krpSeJPhFi+iPd5IbEm+qdEddDvw0EtdUFgBsHFKjlgK31Ij724DjvBKGF7A6Xsz6ixeeZocsVIX3PRoV7MqMXkHp1wlJb49CYq/C4DWJ64zf+6CkszKKcfvbrnZ+JfGmSn/vS5JWR9XIR6O/5VRJbw073B7VzjdJOpxR7ez6dY5XTFMdcKAt9BeSTpO0PxG9wcA/8rkW++ulGeiMO2z/lnRyFHKqQLmz4rCUtd7jc7w/wwHPtYn+7YlGC2g6IOn17sSA0KWSns5sW4bv/2LMgmju90qaSUR/ANURSSt9njUZDjhUNGz8woX3XOCbGTl/AXzHzA4z3zHrmNlx4K6KuKaOKyqfDxnabV6XShHfcF83m9mzNVqg1hb6H8oU3seDgFf2Ekh6s6TpSFxzQtGHK6HtkxmhLTDlCWdmYNTaCrqHYcDzRZPGd/RfAnwiYyNTAldV0RQKama2H/gV882XnJT0ivnlapGjPzXtDO/f4swsor3HeBgQCe8ySU9lCu9dMYt6MGttpBU5PdhpSWf6XN+qkXY+HNYVrW1dBgOONOWAQMPvJWYTwVHPeypY9OrlRqHoT5kZUVjTJkmLJP0n0ZlldIBgzQIOOC/DAUeLJoQX6EpaxdzRjTJxx1sA15vZwagW36u8AHBHjY6ZgMu8Knt6YqMlrPUeM9sV9bYZtuDXSgiKEHBfpvDukjTlaLIBYc4kLZG0t4GTdGXie0PaeUYIuZX7X5+xpummTg6sJ//kwCYzm3XBVZ+qnjwlPQH8uEZKqgzhDei/ycwO9GBqzpHI/H5AQKvH/x9mdK06wM/NbOcCdO73OYB7gemoBZlK+xzjPwncEbpmfRpBI2vIBKN9DViTgP6AvmlgS6hGDlnbljvrAPDLzJQ0t3Z/naedvU5fdzLK5nkOcKOVkt4A3BCVj1MQdaOZ7RsgvP2+f0ei4OeMAKqHzeyBAUwdKQOC0W4A3piQTcSdqtv70LkfC7qOwl3AzpZZENqbm4eJCCNxQCS8q4Gvk9Y7DXT+totp7sMUdVPSYdEf0s7dfdBvNXbCtY5cbI+U3xLo/ICZ/SFBeBdiwayHod8BT/m8ZYPGD0A5Alwf9babtmUaAyL0f4a03mm4oWPA5hThHZAE1E1Jh9GpA0PqVLsOiHqnJ2UUsQKdt5nZXuaPqtQNETDXM34hMyXtZ/wngB1hp5+wq20tC4qfFFmVUOsPmcrTwG0JNzRsSnoQ+EWDYjxs2tlIOC+GRH84svc24BrSGy0GbDazYzWEtx8z72woJQ0h9Y9m9ptEnWo1BAWjbSPtSZFwQw+Z2f11hHdASrobeKQmCxSlndeOKKEZ7IBIeD8OXJIhvDPA1Q0Jb5spadCpuweknaMLQZHwLsqo94QwdbuZ7WlIePulpL934Uze3EUbycMJaedINmLBaBuZewx0WPTHjwttbUp4B6xzxlPSwLrZhGuG+WrnoL5EPzDPZly9hdevnENLodZ/WQhjrVbL5nsFyyUdz+wPPOm9hk7Ccfa4G7gp50unBghvV9JW4LSEkkNgyU4z+1nTwtsnJTUze07Sl4B3OwunfC3xg9XVh6wFLAbuNbMTfrRGiaEW4DHmniuAuSeApnp8f/XB7YWF118/GPVBk48WjgL9C2jW2D6fM6YGLCY8SN1NQEMH2JGZSTSyOSOv11rWSRJc51IzIfVD/4bMo4UHJZ3e74TDZPQXs0LSKZL2ZZ7v+eqoQ8+ryQEB/bcknu+JjxYWE+NnxjBnwDsk/S8h7Syj/+1k3QT99dH/YOb5nrsnxq9v/AsznmgJRwtfdmBpMtKFd4mkPZnCe+UE/fkOCFvpazNDz+5hjhZORn/xXSHphcx6zwUT9Nd3wk/cmCeiDVU3ckj1CunpfRPj1zf+xZnVw6OSzpwIb/1a0Drgt17HWOaVvMV+TUWVvI7/bMBJwK1mtm/U9Z5X2/g/psGbW8kCticAAAAASUVORK5CYII=) center/contain no-repeat}",
    ".dot:before{content:'';position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;background:#34d399;border:2px solid #0f172a}",
    ".ht b{font-size:15px;letter-spacing:.4px;text-transform:none;font-weight:600}.ht span{font-size:12px}",
    ".log{gap:2px}.m{border-radius:20px;padding:9px 14px;margin-top:8px}.m.g{margin-top:0}",
    ".b.gn{border-bottom-left-radius:6px}.b.g{border-top-left-radius:6px}.b.g.gn{border-radius:6px 20px 20px 6px}",
    ".u.gn{border-bottom-right-radius:6px}.u.g{border-top-right-radius:6px}.u.g.gn{border-radius:20px 6px 6px 20px}",
    ".b{border-bottom-left-radius:20px}.u{border-bottom-right-radius:20px}.b.gn{border-bottom-left-radius:6px}.u.gn{border-bottom-right-radius:6px}",
    "form{align-items:center;gap:8px}textarea{border-radius:22px;height:44px;padding:11px 16px}",
    ".send{width:44px;height:44px;padding:0;border-radius:50%;font-size:0;flex:0 0 auto;background:#fff url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23323232' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 19V5'/><path d='M5 12l7-7 7 7'/></svg>\") center/22px no-repeat}}",
    "@media " + PHONE_Q + "{",
    ".head{background:none;border-bottom:0;padding:max(10px,env(safe-area-inset-top,0px)) 14px 6px;gap:0;justify-content:space-between;position:relative;z-index:2}",
    ".x{order:0;margin-right:10px}.dot{order:1;margin-right:12px}.ht{margin-right:8px}.ht{order:2;text-align:left}.nw{order:3}",
    ".x,.nw{width:44px;height:44px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;color:#e5e7eb;border:1px solid rgba(255,255,255,.2);background-color:rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.22);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);flex:0 0 auto}",
    ".x{font-size:0;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e5e7eb' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M15 5l-7 7 7 7'/></svg>\");background-repeat:no-repeat;background-position:center;background-size:18px}",
    ".nw svg{width:20px;height:20px}",
    ".ht b{font-size:15px;font-weight:600;letter-spacing:.3px}.ht span{display:block;font-size:12px;color:#9ca3af}",
    "form{display:grid;grid-template-columns:1fr auto;grid-template-areas:'ta sd';align-items:end;gap:8px;margin:4px 10px 6px;padding:6px 6px 6px 18px;border:1px solid rgba(255,255,255,.2);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.05));box-shadow:inset 0 1px 0 rgba(255,255,255,.22);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}",
    "form:focus-within{border-color:rgba(96,165,250,.7)}.panel.kb form{padding:6px 6px 6px 18px;margin-bottom:8px}",
    "textarea{grid-area:ta;align-self:center;border:0;background:transparent;border-radius:0;padding:6px 0;height:32px;min-height:32px;max-height:120px;box-shadow:none}textarea:focus-visible{outline:none}",
    ".send{grid-area:sd}",
    ".note{background:none;padding:0 16px max(10px,env(safe-area-inset-bottom,0px))}",
    "}",
    ".panel.short .chips,.panel.short .note{display:none}",
    "@media " + PHONE_Q + "{.panel{padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)}",
    ".panel.short .head{padding-top:max(6px,env(safe-area-inset-top,0px));padding-bottom:4px}.panel.short .x,.panel.short .nw{width:36px;height:36px}.panel.short .dot{width:30px;height:30px}.panel.short .dot:after{width:18px;height:11px}.panel.short .dot:before{width:9px;height:9px}.panel.short .ht span{display:none}.panel.short .ht b{font-size:14px}.panel.short .x{margin-right:6px}.panel.short .dot{margin-right:8px}",
    ".panel.short form{margin:2px 10px 6px}.panel.short .log{padding-top:6px}.panel.tiny .head{display:none}",
    "}",
    "@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}"
  ].join("\n");

  function build() {
    host = document.createElement("div");
    host.setAttribute("data-mrkx-chat", "");
    root = host.attachShadow({ mode: "open" });
    root.innerHTML =
      "<style>" + CSS + "</style>" +
      '<button class="launcher" type="button" aria-expanded="false" aria-controls="panel"></button>' +
      '<section class="panel" id="panel" role="dialog" aria-label="">' +
      '<div class="head"><span class="dot"></span><div class="ht"><b></b><span></span></div><button class="nw" type="button" aria-label=""><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4h-4"/></svg></button><button class="x" type="button" aria-label="">×</button></div>' +
      '<div class="cf" hidden><span></span><button type="button" class="cy"></button><button type="button" class="cn"></button></div>' +
      '<div class="log" role="log" aria-live="polite"></div><div class="chips"></div>' +
      '<form autocomplete="off"><textarea rows="1" maxlength="' + CFG.maxLen + '" aria-label=""></textarea><button class="send" type="submit"></button></form>' +
      '<div class="note"></div></section>';
    document.body.appendChild(host);
    elLauncher = root.querySelector(".launcher");
    elPanel = root.querySelector(".panel");
    elLog = root.querySelector(".log");
    elChips = root.querySelector(".chips");
    elInput = root.querySelector("textarea");
    elForm = root.querySelector("form");
    elLauncher.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
    labels();
    elLauncher.addEventListener("click", function () { toggle(!S.open); });
    root.querySelector(".x").addEventListener("click", function () { toggle(false); });
    var cf = root.querySelector(".cf");
    root.querySelector(".nw").addEventListener("click", function () { cf.hidden = false; root.querySelector(".cn").focus(); });
    root.querySelector(".cn").addEventListener("click", function () { cf.hidden = true; focusInput(); });
    root.querySelector(".cy").addEventListener("click", function () { cf.hidden = true; restart(); });
    elForm.addEventListener("submit", function (e) { e.preventDefault(); submit(); });
    elInput.addEventListener("input", grow);
    elInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
    });
    /* Line the launcher up with the site's cookie-preferences button (same vertical centre, mirrored side inset). */
    var cookieBtn = null, tries = 0, mqPhone = window.matchMedia ? window.matchMedia(PHONE_Q) : null;
    function findCookie(root) {
      var all = root.querySelectorAll("*");
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.id === "uc-main-dialog" || (el.classList && el.classList.contains("privacyButton"))) return el;
        if (el.shadowRoot && el !== host) { var f = findCookie(el.shadowRoot); if (f) return f; }
      }
      return null;
    }
    function alignToCookie() {
      if (!cookieBtn || !cookieBtn.isConnected) cookieBtn = findCookie(document);
      if (!cookieBtn) return false;
      var r = cookieBtn.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      var vh = document.documentElement.clientHeight, vw = document.documentElement.clientWidth;
      if (r.width > 100 || r.height > 100) {
        /* The consent dialog itself is open (large): keep the launcher clear of it so it never covers its buttons. */
        host.style.removeProperty("--ls"); host.style.removeProperty("--lr");
        if (r.width > vw * 0.6) host.style.setProperty("--lb", Math.round(vh - r.top + 12) + "px");
        else host.style.removeProperty("--lb");
        return true;
      }
      if (mqPhone && mqPhone.matches) host.style.setProperty("--ls", Math.round(Math.min(r.width, r.height)) + "px");
      else host.style.removeProperty("--ls");
      var lh = elLauncher.offsetHeight || 58;
      var bottom = Math.max(8, Math.round(vh - (r.top + r.height / 2) - lh / 2));
      var side = Math.max(8, Math.round(r.left));
      host.style.setProperty("--lb", bottom + "px");
      host.style.setProperty("--lr", side + "px");
      return true;
    }
    (function poll() {
      var ok = false;
      try { ok = alignToCookie(); } catch (e) {}
      if (!ok && ++tries < 30) setTimeout(poll, 1000);
    })();
    /* Show the chat only once the cookie banner is out of the way (after any consent decision). */
    var ready = false, ucSeen = 0, born = Date.now();
    function setReady(v) {
      if (v === ready) return;
      ready = v;
      host.style.display = v ? "" : "none";
      if (v) { try { alignToCookie(); } catch (e) {} if (window.__mrkxFit) window.__mrkxFit(); }
    }
    function bannerOpen() {
      var el = null;
      try { var uh = document.getElementById("usercentrics-cmp-ui"); el = uh && uh.shadowRoot && uh.shadowRoot.getElementById("uc-main-dialog"); } catch (e) {}
      if (!el) return false;
      var r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      /* Closed state is the 44x44 privacy button inside the same element, so only a large box counts as the open banner. */
      return r.height > 100 && r.width > 100 && cs.visibility !== "hidden" && cs.display !== "none";
    }
    function ucCheck() {
      var u = window.UC_UI;
      if (!u || !u.isInitialized || !u.isInitialized()) {
        if (Date.now() - born > 10000) setReady(true);   // consent tool never loaded (blocked?): do not hide the chat forever
        return;
      }
      if (!ucSeen) ucSeen = Date.now();
      if (Date.now() - ucSeen < 250) return;              // give the first layer a moment to appear before judging
      setReady(!bannerOpen());
    }
    /* Returning visitor: Usercentrics keeps the earlier decision in localStorage ("ucData"), so show the chat at once
       instead of waiting ~2 s for the consent tool to load. If it re-asks later, the view event below hides the chat again. */
    function hasStoredDecision() {
      try { var d = JSON.parse(localStorage.getItem("ucData") || "null"); return !!(d && d.consent && d.consent.services); } catch (e) { return false; }
    }
    if (CFG.noConsentGate || hasStoredDecision()) ready = true; else host.style.display = "none";
    window.addEventListener("UC_UI_VIEW_CHANGED", function (e) {
      var v = e && e.detail && e.detail.view;
      if (v === "PRIVACY_BUTTON") setReady(true);
      else if (v === "FIRST_LAYER" || v === "SECOND_LAYER") setReady(false);
    });
    if (!CFG.noConsentGate) { setInterval(ucCheck, 200); ucCheck(); }
    window.addEventListener("resize", function () { try { alignToCookie(); } catch (e) {} });
    setInterval(function () { try { alignToCookie(); } catch (e) {} }, 1500);
    [1500, 3500, 7000, 12000].forEach(function (ms) { setTimeout(function () { try { alignToCookie(); } catch (e) {} }, ms); });
    if (window.ResizeObserver) { try { new ResizeObserver(function () { try { alignToCookie(); } catch (e) {} }).observe(document.documentElement); } catch (e) {} }
    window.addEventListener("orientationchange", function () { setTimeout(function () { try { alignToCookie(); } catch (e) {} }, 400); });
    /* On phones the on-screen keyboard shrinks the visual viewport: fit the panel into what is visible. */
    var vv = window.visualViewport, mq = window.matchMedia ? window.matchMedia(PHONE_Q) : null;
    function fit() {
      if (!vv || !mq) return;
      if (mq.matches && S.open) {
        var kb = vv.height < window.innerHeight * 0.8;
        elPanel.style.top = vv.offsetTop + "px";
        elPanel.style.bottom = "auto";
        elPanel.style.height = vv.height + "px";
        elPanel.classList.toggle("kb", kb);
        elPanel.classList.toggle("short", vv.height < 380);
        elPanel.classList.toggle("tiny", vv.height < 260);
        scrollEnd();
      } else if (S.open && vv.height < window.innerHeight * 0.85) {
        /* Tablet (e.g. iPad landscape) with the on-screen keyboard up: keep the window inside the visible area. */
        elPanel.style.top = "auto";
        elPanel.style.bottom = Math.max(8, Math.round(window.innerHeight - vv.offsetTop - vv.height + 8)) + "px";
        elPanel.style.height = Math.max(220, Math.min(600, Math.round(vv.height - 16))) + "px";
        elPanel.classList.add("kb");
        elPanel.classList.toggle("short", vv.height < 380);
        scrollEnd();
      } else {
        elPanel.style.top = elPanel.style.bottom = elPanel.style.height = "";
        elPanel.classList.remove("kb"); elPanel.classList.remove("short"); elPanel.classList.remove("tiny");
      }
    }
    window.__mrkxFit = fit;
    if (vv) { vv.addEventListener("resize", fit); vv.addEventListener("scroll", fit); }
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", function () { setTimeout(fit, 350); });
    elPanel.addEventListener("keydown", function (e) { if (e.key === "Escape") { toggle(false); elLauncher.focus(); } });
  }
  function labels() {
    root.querySelector(".ht b").textContent = T("title");
    root.querySelector(".ht span").textContent = T("sub");
    elPanel.setAttribute("aria-label", T("title"));
    root.querySelector(".x").setAttribute("aria-label", T("close"));
    root.querySelector(".nw").setAttribute("aria-label", T("renew")); root.querySelector(".nw").title = T("renew");
    root.querySelector(".cf span").textContent = T("renewQ");
    root.querySelector(".cy").textContent = T("renewYes"); root.querySelector(".cn").textContent = T("renewNo");
    elInput.placeholder = T("ph"); elInput.setAttribute("aria-label", T("ph"));
    root.querySelector(".send").textContent = T("send");
    root.querySelector(".note").textContent = T("note");
    elLauncher.setAttribute("aria-label", T("open"));
  }
  function toggle(open) {
    S.open = !!open;
    elPanel.classList.toggle("open", S.open);
    elLauncher.setAttribute("aria-expanded", S.open ? "true" : "false");
    if (window.__mrkxFit) window.__mrkxFit();
    if (S.open) {
      if (!S.greeted) { S.greeted = true; welcome(); }
      setTimeout(function () { focusInput(); scrollEnd(); }, 30);
    }
    save();
  }
  /* Touch devices: never pop the keyboard up on their own (it would cover the conversation). */
  function focusInput() {
    if (window.matchMedia && window.matchMedia("(pointer:coarse)").matches) return;
    elInput.focus();
  }
  function scrollEnd() { elLog.scrollTop = elLog.scrollHeight; }
  function grow() {
    elInput.style.height = "auto";
    var h = elInput.scrollHeight + (elInput.offsetHeight - elInput.clientHeight);
    elInput.style.height = Math.min(h, 120) + "px";
    if (!elInput.value) elInput.style.height = "";
  }
  function addBubble(role, text) {
    var d = document.createElement("div");
    d.className = "m " + (role === "u" ? "u" : "b");
    var last = elLog.lastElementChild;
    if (last && last.classList.contains(role === "u" ? "u" : "b")) { last.classList.add("gn"); d.classList.add("g"); }
    d.innerHTML = fmt(text);
    elLog.appendChild(d);
    scrollEnd();
    return d;
  }
  function showChips(chips) {
    elChips.innerHTML = "";
    (chips || []).forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = c.t;
      b.addEventListener("click", function () { chipClick(c); });
      elChips.appendChild(b);
    });
    scrollEnd();
  }

  /* ---------- output queue ---------- */
  var GEN = 0;
  function restart() {
    GEN++; Q = Promise.resolve();
    try { sessionStorage.removeItem(CFG.storageKey); } catch (e) {}
    S = fresh(); S.lang = PAGE_IS ? "is" : "en"; S.open = true; S.greeted = true;
    elLog.innerHTML = ""; showChips(null); labels(); save(); welcome();
    setTimeout(function () { focusInput(); }, 30);
  }
  function say(text, chips) {
    var g = GEN;
    var delay = CFG.fast ? 0 : Math.min(420 + text.length * 7, 1300);
    Q = Q.then(function () {
      return new Promise(function (resolve) {
        var ty;
        if (delay) { ty = document.createElement("div"); ty.className = "typing"; ty.innerHTML = "<i></i><i></i><i></i>"; elLog.appendChild(ty); scrollEnd(); }
        setTimeout(function () {
          if (ty && ty.parentNode) ty.parentNode.removeChild(ty);
          if (g !== GEN) { resolve(); return; }
          addBubble("b", text);
          S.hist.push({ r: "b", t: text });
          showChips(chips);
          S.hist[S.hist.length - 1].chips = chips || null;
          save();
          resolve();
        }, delay);
      });
    });
    return Q;
  }

  /* ---------- core ---------- */
  function welcome() {
    var txt = T("welcome");
    var chips = PAGE_IS
      ? [{ t: "What do you offer?", go: "services" }, { t: "Free analysis", go: "free_analysis" }, { t: "Senda til teymisins", go: "human" }]
      : [{ t: "What do you offer?", go: "services" }, { t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }, { t: "Talk to the team", go: "human" }];
    say(txt, chips);
  }

  function submit() {
    var raw = elInput.value.replace(/\s+/g, " ").trim();
    if (!raw) return;
    elInput.value = ""; grow();
    userSays(raw, false);
  }
  function chipClick(c) {
    userSays(c.t, true, c);
  }

  function userSays(raw, fromChip, chip) {
    if (raw.length > CFG.maxLen) raw = raw.slice(0, CFG.maxLen);
    showChips(null);
    if (S.msgs >= CFG.maxMessages) { addBubble("u", raw); return say(T("tooMany")); }
    S.msgs++;
    var bad = !fromChip && sensitive(raw);
    addBubble("u", bad ? "•••" : raw);
    S.hist.push({ r: "u", t: bad ? "[removed: sensitive data]" : raw });
    save();
    if (bad) return say(T("sensitive"));
    return handle(raw, fromChip, chip);
  }

  function handle(raw, fromChip, chip) {
    // 1. chip actions
    if (chip && chip.go) { if (String(chip.go).indexOf("q:") !== 0 && String(chip.go).indexOf("d:") !== 0) dropAwaiting(); return route(chip.go); }

    // 2. active flow consumes input
    if (S.flow) { var r = flowInput(raw); if (r !== false) return r; }

    // 3. icelandic
    if (!fromChip && !PAGE_IS && S.lang === "is" && !isIcelandic(raw) && words(raw).split(" ").length >= 3) { S.lang = "en"; labels(); }
    if (!fromChip && isIcelandic(raw)) {
      S.lang = "is"; labels();
      if (/teymi|senda|starfsmann|manneskj/i.test(raw)) return route("human");
      return say(T("isNote"), [{ t: "Svara á ensku", go: "services" }, { t: "Senda til teymisins", go: "human" }]);
    }

    var M = toks(raw);

    // 4. opportunistic slots
    var em = findEmail(raw); if (em) S.slots.email = em;
    var nm = raw.match(/\b(?:my name is|call me|i am called|i'm called)\s+([A-Za-zÀ-ÿÞþÐðÆæÖö'-]{2,30})/i);
    var nameLine = "";
    if (nm && !S.slots.name) { S.slots.name = nm[1].charAt(0).toUpperCase() + nm[1].slice(1); nameLine = T("thanksName", { name: S.slots.name }) + " "; }

    // 7. "tell me more"
    if (S.cont && /^(more|tell me more|go on|details|more details?|elaborate|continue|keep going|more info|more information|yes|yes please|ok|okay|sure)$/.test(words(raw))) return contAnswer(nameLine);
    if (/^(more|tell me more|go on|details|more details?|more detail please|elaborate|and|continue|keep going|next|next one|why|really|can you elaborate|more info|more information|details please)$/.test(words(raw))) {
      if (S.topic && SEC[S.topic] && S.last && /^(svc_|sec|doc)/.test(String(S.last))) { S.lastMore = null; return secNext(S.topic, nameLine); }
      if (S.topic && SEC[S.topic] && S.lastMore) { S.lastMore = null; return secNext(S.topic, nameLine); }
      if (S.lastMore) { var mt = S.lastMore; S.lastMore = null; return finish(nameLine + mt, [{ t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }], null, true); }
      return say(nameLine + T("moreNone"), [{ t: "Services", go: "services" }, { t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }]);
    }

    // 4b. business type mentioned in passing ("I run a small cafe")
    if (!S.slots.biz && /\b(i run|i own|we run|we own|i'm a|i am a|we're a|we are a|i sell|we sell|i'm starting|i am starting|we're starting|my (small |little |new )?(business|company|shop|cafe|café|restaurant|store|studio|hotel)|i have a (small |little )?(business|company|shop|cafe|café|restaurant|store|studio|hotel)|for my)\b/i.test(raw)) {
      var bk = bizKey(raw);
      if (bk) {
        S.slots.biz = raw.slice(0, 120); S.slots.bizKey = bk; S.asked.biz = true;
        var bml = KB.bizMap.filter(function (b) { return b.key === bk; })[0];
        if (bml) nameLine += bml.line + "\n\n";
      }
    }

    // 5. awaiting qualification answer
    if (S.awaiting) {
      var aw = awaitingInput(raw, M);
      if (aw !== false) return aw;
    }

    // 6. yes / no for a pending offer
    var yn = yesNo(raw);
    if (S.pending && yn) {
      var p = S.pending; S.pending = null;
      if (yn === "yes") {
        if (p === "analysis") return route("analysis_start");
        if (p === "consult") return route("handoff_start_consult");
        if (p === "handoff") return route("handoff_start");
      } else { return route("decline"); }
    }

    // 8. intent matching
    var ranked = scoreAll(M);
    var best = ranked[0];
    var msgTopic0 = topicOf(M);
    var sec = bestSection(M, msgTopic0);
    var cue = DETAIL_CUE.test(raw), priceQ = /\b(price|prices|pricing|cost|costs|how much|quote|budget)\b/i.test(raw) || /\banalysis\b/i.test(raw);
    var rt0 = (!priceQ) ? retrieve(raw, msgTopic0) : null;
    if (rt0 && rt0.d.kind === "faq" && rt0.sc >= RT_FAQ && rt0.mt >= 2 && !cue && (!best || best.it.kind === "faq" || (best.it.kind === "topic" && content(raw).length >= 3))) { S.fails = 0; return docAnswer(rt0.d, nameLine); }
    if (sec && (cue || !best || best.it.kind === "topic" || sec.sc >= best.sc - 0.5) && !(priceQ && !(best && best.sc < sec.sc))) return secAnswer(sec.key, sec.idx, nameLine);
    if (cue && !priceQ && (msgTopic0 || S.topic) && SEC[msgTopic0 || S.topic] && (!best || best.it.kind === "topic" || best.sc < 3)) return secOverview(msgTopic0 || S.topic, nameLine);
    var rt = (!priceQ || cue) ? retrieve(raw, msgTopic0) : null;
    if (rt && rt.sc >= RT_MIN && rt.mt >= 2 && (!best || best.sc < 2.5 || (best.it.kind === "topic" && content(raw).length >= 3)) && words(raw).split(" ").length >= 2) { S.fails = 0; return docAnswer(rt.d, nameLine); }
    if (best && best.sc >= 1.5) {
      S.fails = 0;
      if (best.it.kind === "topic") S.topic = best.it.topic;
      var msgTopic = topicOf(M);
      return route(best.it.id, { msgTopic: msgTopic, prefix: nameLine, secChip: sec && best.it.kind === "faq" ? { t: "More detail", go: "sec:" + sec.key + ":" + sec.idx } : null });
    }

    // 9. url / email given out of the blue → likely wants analysis or handoff
    if (normUrl(raw) && !em) { S.slots.url = normUrl(raw); return say(nameLine + "Thanks. Would you like us to run the free website and search analysis for " + domainOf(S.slots.url) + "?", [{ t: "Yes, set it up", go: "analysis_start" }, { t: "Not now", go: "decline" }]); }

    // 10. fallback
    S.fails++;
    if (S.fails >= 2) { S.pending = "handoff"; return say(nameLine + KB.fallbackSecond, [{ t: "Yes, please", go: "handoff_start" }, { t: "Not now", go: "decline" }]); }
    return say(nameLine + pick(KB.fallbackFirst, "fb"), [{ t: "What do you offer?", go: "services" }, { t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }, { t: "Talk to the team", go: "human" }]);
  }

  function words(raw) { return norm(raw).replace(/[^a-z0-9#]+/g, " ").trim(); }
  function yesNo(raw) {
    var s = words(raw);
    if (/^(yes|yeah|yep|yup|sure|ok|okay|please|go ahead|do it|sounds good|y|yes please|of course|definitely|let s do it|set it up|ja|ju|endilega|ja takk|ja endilega)$/.test(s)) return "yes";
    if (/^(no|nope|nah|not now|later|no thanks|no thank you|maybe later|n|not really|nei|nei takk|ekki nuna|seinna)$/.test(s)) return "no";
    return null;
  }

  /* route by intent id or action id */
  function route(id, opt) {
    if (id === "cont") return S.cont ? contAnswer("") : say(T("moreNone"), [{ t: "Services", go: "services" }, { t: "Pricing", go: "pricing" }]);
    opt = opt || {};
    if (id.indexOf("q:") === 0) {
      var parts = id.split(":");
      if (parts[1] === "skip") { S.awaiting = null; return say(T("declined"), [{ t: "What do you offer?", go: "services" }, { t: "Pricing", go: "pricing" }]); }
      return storeAnswer(parts[1], parts.slice(2).join(":"));
    }
    if (id === "analysis_start") return startFlow("analysis");
    if (id === "handoff_start") return startFlow("handoff");
    if (id === "handoff_start_consult") return startFlow("consult");
    if (id === "decline") { S.pending = null; return say(T("declined"), [{ t: "What do you offer?", go: "services" }, { t: "Pricing", go: "pricing" }]); }
    if (id === "flow:cancel") return cancelFlow();
    if (id === "flow:nosite") { S.flow = null; S.pending = "consult"; return say(T("noSite"), [{ t: "Yes, please", go: "handoff_start_consult" }, { t: "Not now", go: "decline" }]); }
    if (id === "flow:skip") return flowInput("__skip__");
    if (id === "flow:agree") return flowInput("__agree__");
    if (id === "flow:dupyes") { S.pending = null; S.flow = { type: "handoff", step: null, data: S.dupData || {} }; S.flow.data.noteAsked = false; return nextStep(); }
    if (id === "d:skip") { discState().skips++; S.awaiting = null; save(); return say(T("declined"), [{ t: "What do you offer?", go: "services" }, { t: "Pricing", go: "pricing" }]); }
    if (id.indexOf("d:") === 0) { var dp = id.split(":"); return discAnswer(dp[1], dp[2], parseInt(dp[3], 10)); }
    if (id.indexOf("doc:") === 0) { var dd = DOCS[parseInt(id.slice(4), 10)]; if (dd) return docAnswer(dd, opt.prefix || ""); }
    if (id.indexOf("sec:") === 0) {
      var sp = id.split(":");
      if (SEC[sp[1]]) return sp.length > 2 ? secAnswer(sp[1], parseInt(sp[2], 10), opt.prefix || "") : secOverview(sp[1], opt.prefix || "");
    }
    if (id === "more") {
      if (S.lastMore) { var mt2 = S.lastMore; S.lastMore = null; return finish(mt2, [{ t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }], null, true); }
      return say(T("moreNone"), [{ t: "Services", go: "services" }, { t: "Pricing", go: "pricing" }]);
    }
    if (id === "pricing") return finish((opt.prefix || "") + priceText(opt.msgTopic || S.topic), priceChips(), { id: "pricing", kind: "question" });
    if (id === "human" && S.lang === "is") { S.pending = "handoff"; return say(T("askHandoff"), [{ t: T("yes"), go: "handoff_start" }, { t: T("notNow"), go: "decline" }]); }
    var it = byId(id);
    if (!it) return say(T("moreNone"));
    var cc = it.chips; if (opt.secChip) cc = [opt.secChip].concat(cc || []);
    return finish((opt.prefix || "") + pick(it.a, it.id), cc, it);
  }

  function priceText(topic) {
    var w = KB.priceWeb, s = KB.priceSeo, a = KB.priceApp;
    if (topic === "website") return "Our Business Website projects start from " + w + " plus VAT. The final price depends on the number of pages, languages, integrations and content, so the best next step is a short consultation, where we shape the price around your project.";
    if (topic === "seo") return "Our Search Foundation work starts from " + s + " plus VAT. What you need beyond that depends on your site and goals, so we shape the scope and the price in a short consultation.";
    if (topic === "app") return "Our mobile app projects start from " + a + " plus VAT. We first check whether an app is the right solution at all, and the final price depends on the features, platforms and integrations. A short consultation is the best next step, where we shape the scope and the price around your project.";
    if (topic === "landing" || topic === "brand" || topic === "automation") return "That one is priced per project, because the scope varies a lot. In a short consultation we look at your goals and give you a clear price for it. For reference, our starting prices are " + w + " for a Business Website, " + s + " for Search Foundation and " + a + " for a mobile app, all plus VAT.";
    return "Our starting prices are: Business Website from " + w + ", Search Foundation from " + s + " and Mobile App from " + a + ", all plus VAT. Everything else (landing pages, automation, brand systems) is priced per project. The best way to get a real price is a short consultation, where we shape the scope around your goals.";
  }
  function priceChips() { return [{ t: "Book a consultation", go: "consultation" }, { t: "Free analysis", go: "free_analysis" }]; }

  /* finish an answer: set memory, pending, qualification, CTA */
  function finish(text, chips, it, noCount) {
    var id = it && it.id;
    if (S.keepCont) S.keepCont = 0; else S.cont = null;
    if (it && it.topic) S.topic = it.topic;
    if (it && it.more) S.lastMore = it.more; else if (!noCount) S.lastMore = null;
    S.pending = it && it.pending ? it.pending : null;
    S.last = id || S.last;
    var counts = !(it && it.noCount) && !(it && it.kind === "rule");
    if (counts && !noCount) S.subst++;
    // personalised line once per service topic after business type is known
    if (it && it.kind === "topic" && S.slots.bizKey && !S.slots["pl_" + it.topic]) {
      var bm = KB.bizMap.filter(function (b) { return b.key === S.slots.bizKey; })[0];
      if (bm) { text += "\n\n" + bm.line; S.slots["pl_" + it.topic] = 1; }
    }
    var p = say(text, chips);
    if (it && it.kind === "topic" && DISC[it.topic] && !S.pending && !S.flow && !S.awaiting) { var dq0 = (discState().tick++, nextDisc(it.topic)); if (dq0) { save(); return Promise.resolve(p).then(function () { return askDisc(it.topic, dq0); }); } }
    // qualification / offer (one per turn, never when a question is already open)
    var skipQual = it && (it.noCount || it.kind === "rule" || /^(pricing|objection|free_analysis|consultation|human|about_bot|greet|analysis_detail)$/.test(it.id));
    if (counts && !S.pending && !S.flow && !skipQual && !/\?\s*$/.test(text)) {
      var next = nextQualifier();
      if (next) p = next();
    }
    save();
    return p;
  }

  function nextQualifier() {
    if (S.subst >= 2 && !S.asked.biz && !S.ignored) return function () { S.asked.biz = true; S.awaiting = "biz"; return say(T("qBiz"), [{ t: "Restaurant or café", go: "q:biz:Restaurant or café" }, { t: "Shop", go: "q:biz:Shop" }, { t: "Service business", go: "q:biz:Service business" }, { t: "Tourism", go: "q:biz:Tourism" }, { t: "New business", go: "q:biz:New business" }, { t: T("skip"), go: "q:skip" }]); };
    if (S.subst >= 4 && S.asked.biz && !S.asked.goal && !S.ignored) return function () { S.asked.goal = true; S.awaiting = "goal"; return say(T("qGoal"), [{ t: "More enquiries", go: "q:goal:More enquiries" }, { t: "Online sales", go: "q:goal:More online sales" }, { t: "A clearer site", go: "q:goal:A clearer site" }, { t: "Found on Google", go: "q:goal:Being found on Google" }, { t: T("skip"), go: "q:skip" }]); };
    if (S.subst >= 5 && !S.offeredAnalysis && !S.sent) return function () { S.offeredAnalysis = true; S.pending = "analysis"; return say(T("offerAnalysis"), [{ t: "Yes, set it up", go: "analysis_start" }, { t: "Not now", go: "decline" }]); };
    if (S.subst >= 6 && S.asked.goal && !S.asked.timing && !S.ignored) return function () { S.asked.timing = true; S.awaiting = "timing"; return say(T("qTiming"), [{ t: "As soon as possible", go: "q:timing:As soon as possible" }, { t: "Within 3 months", go: "q:timing:Within 3 months" }, { t: "Just exploring", go: "q:timing:Just exploring" }, { t: T("skip"), go: "q:skip" }]); };
    return null;
  }

  function storeAnswer(kind, value) {
    S.awaiting = null;
    S.slots[kind] = value.slice(0, 120);
    var line = T("qThanks");
    if (kind === "biz") {
      var key = bizKey(value); if (key) S.slots.bizKey = key;
      var bm = key && KB.bizMap.filter(function (b) { return b.key === key; })[0];
      if (bm) line += " " + bm.line;
    }
    S.pending = null;
    var chips = kind === "timing" ? [{ t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }] : [{ t: "What do you offer?", go: "services" }, { t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }];
    save();
    return say(line, chips);
  }
  function bizKey(text) {
    var M = toks(text);
    for (var i = 0; i < KB.bizMap.length; i++) {
      var b = KB.bizMap[i];
      for (var j = 0; j < b.words.length; j++) if (hasSeq(M, toks(b.words[j]))) return b.key;
    }
    return null;
  }
  function dropAwaiting() { if (S.awaiting) { S.awaiting = null; S.ignored = (S.ignored || 0) + 1; } }
  function awaitingInput(raw, M) {
    var kind = S.awaiting;
    if (/\?\s*$/.test(raw)) { dropAwaiting(); return false; }
    if (kind.indexOf("disc:") === 0) {
      var dpp = kind.split(":");
      var rk = scoreAll(M)[0], rr = retrieve(raw, dpp[1]);
      var askLike = /^(tell|what|whats|how|why|when|where|which|who|can|could|do|does|did|is|are|will|would|should|explain|give|show|i want|i need|i would like|more|details?)\b/i.test(raw.trim()) && !/^(what s|whats) (my|our)\b/i.test(raw.trim());
      if (askLike || words(raw).split(" ").length > 9 || (rk && rk.sc >= 2.5) || (rr && rr.mt >= 3 && rr.sc >= 0.6)) { dropAwaiting(); return false; }
      if (/^(skip|no|nope|nothing|not sure|none|pass)$/i.test(raw.trim())) { discState().skips++; S.awaiting = null; return say(T("declined")); }
      return discAnswer(dpp[1], dpp[2], null, raw);
    }
    if (/^(skip|no|nope|nothing|not sure|none|pass)$/i.test(raw.trim())) { dropAwaiting(); return say(T("declined")); }
    var ranked = scoreAll(M), sc = ranked[0] ? ranked[0].sc : 0;
    if (kind === "biz") {
      if (bizKey(raw) || (words(raw).split(" ").length <= 4 && sc < 1.5)) return storeAnswer(kind, raw);
      dropAwaiting(); return false;
    }
    if (sc >= 1.5) { dropAwaiting(); return false; }
    return storeAnswer(kind, raw);
  }

  /* ---------- flows (analysis, handoff, consultation) ---------- */
  function startFlow(type) {
    if (S.sent && type === "analysis") return say(T("sentOnce"));
    S.pending = null; S.awaiting = null;
    S.flow = { type: type, step: null, data: {} };
    if (S.lang !== "is" && PAGE_IS) { /* keep chat language as is */ }
    if (type === "analysis") {
      if (S.slots.url) { S.flow.data.url = S.slots.url; return nextStep(); }
      S.flow.step = "url"; return say(T("askUrl"), [{ t: "I don't have a website", go: "flow:nosite" }, { t: T("cancel"), go: "flow:cancel" }]);
    }
    return nextStep();
  }
  function cancelFlow() { S.flow = null; save(); return say(T("cancelled"), [{ t: "What do you offer?", go: "services" }, { t: "Pricing", go: "pricing" }]); }

  function nextStep() {
    var f = S.flow, d = f.data, isA = f.type === "analysis";
    var skipChip = [{ t: T("skip"), go: "flow:skip" }, { t: T("cancel"), go: "flow:cancel" }];
    if (isA && !d.url) { f.step = "url"; return say(T("askUrl"), [{ t: "I don't have a website", go: "flow:nosite" }, { t: T("cancel"), go: "flow:cancel" }]); }
    if (!d.email) { if (S.slots.email) { d.email = S.slots.email; } else { f.step = "email"; return say(T("askEmail"), [{ t: T("cancel"), go: "flow:cancel" }]); } }
    if (!d.nameAsked) { d.nameAsked = true; if (S.slots.name) d.name = S.slots.name; else { f.step = "name"; return say(T("askName"), skipChip); } }
    if (isA && !d.companyAsked) { d.companyAsked = true; f.step = "company"; return say(T("askCompany"), skipChip); }
    if (!isA && !d.noteAsked) { d.noteAsked = true; f.step = "note"; return say(T("askNote"), skipChip); }
    f.step = "consent";
    return say(T(isA ? "consentAnalysis" : "consentHandoff", { email: d.email }), [{ t: T("agree"), go: "flow:agree" }, { t: T("cancel"), go: "flow:cancel" }]);
  }

  function flowInput(raw) {
    var f = S.flow; if (!f) return false;
    var d = f.data, step = f.step, txt = raw.trim();
    if (/^(cancel|stop|never ?mind|forget it|hætta við)$/i.test(txt)) return cancelFlow();
    if (step === "url") {
      if (/(don'?t have|no website|no site|none|nothing|do not have)/i.test(txt)) return route("flow:nosite");
      var u = normUrl(txt);
      if (!u) return maybeAnswerThenRe(raw, "badUrl");
      d.url = u; S.slots.url = u; save(); return nextStep();
    }
    if (step === "email") {
      var e = findEmail(txt);
      if (!e || !isEmail(e)) return maybeAnswerThenRe(raw, "badEmail");
      d.email = e; S.slots.email = e; save(); return nextStep();
    }
    if (step === "name") {
      if (txt !== "__skip__" && !/^skip$/i.test(txt)) { d.name = txt.replace(/^(i am|i'm|my name is|it's|its)\s+/i, "").slice(0, 60); S.slots.name = d.name; }
      save(); return nextStep();
    }
    if (step === "company") {
      if (txt !== "__skip__" && !/^skip$/i.test(txt)) d.company = txt.slice(0, 80);
      save(); return nextStep();
    }
    if (step === "note") {
      if (txt !== "__skip__" && !/^skip$/i.test(txt)) d.note = txt.slice(0, 400);
      save(); return nextStep();
    }
    if (step === "consent") {
      var cw = words(txt);
      if (txt === "__agree__" || /^(yes|yeah|yep|ok|okay|sure|agree|i agree|fine|go ahead|that s ok|that s okay|ja|ju|endilega)\b/.test(cw)) return sendFlow();
      if (/^(no|nope|cancel|stop|nei)\b/.test(cw)) return cancelFlow();
      return say(T(f.type === "analysis" ? "consentAnalysis" : "consentHandoff", { email: d.email }), [{ t: T("agree"), go: "flow:agree" }, { t: T("cancel"), go: "flow:cancel" }]);
    }
    return false;
  }
  // invalid input: if it is clearly a question, answer it, then re-ask the step
  function maybeAnswerThenRe(raw, badKey) {
    var M = toks(raw), ranked = scoreAll(M);
    if (ranked[0] && ranked[0].sc >= 2.5 && !/@|\./.test(raw)) {
      var it = ranked[0].it, step = S.flow.step;
      var p = say(pick(it.a.length ? it.a : [priceText(S.topic)], it.id));
      return p.then(function () { return say(T("reAsk") + " " + T(step === "url" ? "askUrl" : "askEmail")); });
    }
    return say(T(badKey));
  }

  function transcript() {
    return S.hist.map(function (h) { return { r: h.r === "u" ? "visitor" : "bot", t: plain(h.t) }; });
  }
  function sendFlow() {
    var f = S.flow, d = f.data;
    if (S.sending) return Q;
    S.sending = true;
    var payload = {
      type: f.type === "analysis" ? "analysis" : (f.type === "consult" ? "consultation" : "handoff"),
      lang: S.lang, page: location.href.slice(0, 300), ts: S.t0, sentTs: Date.now(),
      email: d.email, name: d.name || S.slots.name || "", company: d.company || "", url: d.url || "", note: d.note || "",
      slots: { business: S.slots.biz || "", goal: S.slots.goal || "", timing: S.slots.timing || "", topic: S.topic || "" },
      consent: true, hp: "", transcript: transcript()
    };
    var kind = f.type;
    S.flow = null; save();
    return post(payload).then(function (res) {
      S.sending = false;
      if (res && res.ok) {
        S.sent = true; save();
        return say(T(kind === "analysis" ? "sentAnalysis" : "sentHandoff"), [{ t: "What do you offer?", go: "services" }, { t: "Contact", go: "contact" }]);
      }
      if (res && res.reason === "cap") return say(T("cap"));
      if (res && res.reason === "duplicate") { S.pending = "handoff"; S.flow = null; S.slots.dupEmail = d.email; S.dupData = d; return say(T("dup"), [{ t: "Yes, please", go: "flow:dupyes" }, { t: "Not now", go: "decline" }]); }
      return say(T("err"));
    });
  }
  function post(payload) {
    if (!CFG.endpoint) {
      window.__mrkxLast = payload;
      try { console.log("[MRKX chat demo] nothing was sent. Payload:", payload); } catch (e) {}
      return new Promise(function (r) {
        setTimeout(function () { r(CFG.demoResult === "ok" ? { ok: true } : { ok: false, reason: CFG.demoResult }); }, CFG.fast ? 0 : 700);
      });
    }
    return fetch(CFG.endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, reason: "network" }; });
  }

  /* ---------- init ---------- */
  function restore() {
    if (!S.hist.length) return;
    S.hist.forEach(function (h) { addBubble(h.r, h.t); });
    var last = S.hist[S.hist.length - 1];
    if (last && last.chips) showChips(last.chips);
    if (S.open) { elPanel.classList.add("open"); elLauncher.setAttribute("aria-expanded", "true"); }
    labels();
  }
  function init() {
    if (!document.body) return setTimeout(init, 50);
    load();
    S.lang = S.lang || (PAGE_IS ? "is" : "en");
    build();
    restore();
    window.MRKXChat = {
      open: function () { toggle(true); },
      close: function () { toggle(false); },
      ask: function (t) { return Promise.resolve(userSays(t, false)).then(function () { return Q; }); },
      done: function () { return Q; },
      state: function () { return JSON.parse(JSON.stringify(S)); },
      reset: function () { restart(); }
    };
  }
  var start = CFG.delay == null ? 1200 : CFG.delay;
  function boot() { setTimeout(init, start); }
  if (document.readyState === "complete") boot(); else window.addEventListener("load", boot);
})();
})();
