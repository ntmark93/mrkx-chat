(function(){
/* MRKX Assistant knowledge base (English answers, studio voice "we").
   Facts only from mrkxlabs.com. Prices: published starting prices only. */
var MRKX_KB = (function () {
  var P_WEB = "250,000 ISK";
  var P_SEO = "150,000 ISK";

  var links = {
    home: "/", services: "/services", website: "/services/websites", seo: "/services/seo",
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

    { id: "about", kind: "question", kw: ["about you", "about mrkx", "who is mrkx", "what is mrkx", "tell me about your company", "who are mrkx labs", "your company", "your background", "your experience", "who is behind", "your studio", "your team", "your approach"],
      a: ["MRKX Labs is a digital systems studio based in Höfn, Iceland. We combine strategy, sales thinking, marketing structure, design, web development, SEO and analytics, so a website isn't just a nice surface but a path from attention to trust to enquiry. Our principles are clarity, credibility and action. [About us](/about)"],
      more: "We define the offer, audience, positioning and message flow before we build anything visual. That's why we treat every website, landing page or brand system as part of a bigger growth system rather than a standalone design.",
      chips: [{ t: "What do you offer?", go: "services" }, { t: "How do you work?", go: "process" }, { t: "Examples of your work", go: "portfolio" }] },

    { id: "services", kind: "question", kw: ["what do you offer", "what do you do", "your services", "services", "what can you do", "what do you build", "offer", "capabilities", "svara a ensku"],
      a: ["We offer six things: landing pages, business websites, SEO strategy, brand systems, automation and mobile apps. They work on their own, but they're strongest as one connected system. Which one is closest to what you need? [All services](/services)"],
      chips: [{ t: "Website", go: "svc_website" }, { t: "SEO", go: "svc_seo" }, { t: "Landing page", go: "svc_landing" }, { t: "Brand", go: "svc_brand" }, { t: "Automation", go: "svc_automation" }, { t: "Mobile app", go: "svc_app" }] },

    { id: "svc_website", kind: "topic", topic: "website", kw: ["website", "web site", "web design", "web development", "business website", "company website", "build a site", "new site", "webpage", "homepage", "site design", "redesign"],
      a: ["Our website work covers structure, design, development and the technical SEO foundations: page hierarchy, responsive build, performance, accessibility basics, analytics and integrations. Business Website projects start from " + P_WEB + " plus VAT. [Website service](/services/websites)"],
      more: "We plan the information architecture before the visual design: page hierarchy, navigation, URL structure and internal linking. After launch we also review forms, responsiveness, metadata, analytics, indexing and performance under real conditions.",
      chips: [{ t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }, { t: "How do you work?", go: "process" }] },

    { id: "svc_seo", kind: "topic", topic: "seo", kw: ["seo", "search engine", "google ranking", "rank on google", "found on google", "search visibility", "search foundation", "organic traffic", "keywords"],
      a: ["Our SEO strategy work covers page structure, relevant content, technical foundations, metadata, internal linking and local search readiness. Our Search Foundation work starts from " + P_SEO + " plus VAT. [SEO service](/services/seo)"],
      more: "We focus on what we can influence: technical foundations, page structure, content clarity, local relevance and measurement. We don't promise rankings, because search engines decide those.",
      chips: [{ t: "Pricing", go: "pricing" }, { t: "How long does SEO take?", go: "seo_time" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "svc_landing", kind: "topic", topic: "landing", kw: ["landing page", "landing pages", "campaign page", "ad page", "conversion page", "lead page", "funnel"],
      a: ["A landing page is a focused page for one campaign, audience or offer, built to turn interest into enquiries. Copy, structure and tracking are planned together instead of adding text after the design. Landing pages are priced per project, so it's best to talk it through in a short consultation. [Services](/services)"],
      chips: [{ t: "Landing page vs website", go: "landing_vs_site" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "svc_brand", kind: "topic", topic: "brand", kw: ["brand", "branding", "brand system", "logo", "visual identity", "brand identity", "brand design"],
      a: ["A brand system is more than a logo. It defines how your identity works across visuals, messaging, your website and future assets, so everything feels consistent and trustworthy. It's priced per project. [Services](/services)"],
      chips: [{ t: "Brand system vs logo", go: "brand_vs_logo" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "svc_automation", kind: "topic", topic: "automation", kw: ["automation", "automate", "automations", "workflow", "crm", "zapier", "n8n", "make.com", "business automation"],
      a: ["We build automation for repetitive, rule-based work such as lead handling, CRM updates, follow-up emails, reporting, notifications and booking flows. Work that needs human judgment is supported rather than replaced. It's priced per project. [Services](/services)"],
      chips: [{ t: "What can be automated?", go: "automation_what" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "svc_app", kind: "topic", topic: "app", kw: ["mobile app", "app development", "ios app", "android app", "build an app", "an app", "application", "app store", "google play"],
      a: ["We design and develop mobile apps, but we first check whether an app is the right solution at all. It makes sense when users need repeat access, accounts, offline use or push notifications. It's priced per project. [Services](/services)"],
      chips: [{ t: "Do I need an app?", go: "app_need" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "pricing", kind: "question", kw: ["price", "prices", "pricing", "cost", "costs", "how much", "quote", "budget", "rate", "rates", "fee", "fees", "vat", "charge", "package", "packages", "estimate", "starting from", "afford"],
      a: [] /* built in bot.js using topic */ },

    { id: "objection", kind: "question", kw: ["expensive", "too much", "too expensive", "cheaper", "cheap", "discount", "can't afford", "cannot afford", "out of my budget", "pricey", "lower price", "negotiate"],
      a: ["I understand, it's a real investment. We don't compete on being the cheapest. We focus on a clear offer, a site that builds trust and a path that turns visits into enquiries, so the money works for you. The most useful next step is a short consultation, where we look at your goals and shape the scope and price around them rather than around a fixed package."],
      chips: [{ t: "Book a consultation", go: "consultation" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "timeline", kind: "question", kw: ["how long", "how fast", "how quickly", "timeline", "turnaround", "deadline", "delivery time", "when will", "how many weeks", "how many days", "time frame", "timeframe", "lead time", "asap"],
      a: ["The timeline depends on the scope, so I can't promise dates here. The one timeline I can give is for the free analysis: you get it as a PDF by email within 48 hours. For a project, we agree the schedule after a short consultation."],
      chips: [{ t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }] },

    { id: "process", kind: "question", kw: ["process", "how do you work", "how does it work", "how it works", "workflow", "your method", "methodology", "steps", "approach", "how do we start", "what happens first", "development method"],
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

    { id: "contact", kind: "question", kw: ["contact", "phone", "phone number", "telephone", "email address", "e-mail", "address", "where are you", "number", "reach you", "social media", "instagram", "linkedin", "facebook"],
      a: ["You can reach us at hello@mrkxlabs.com or +354 837 8339. Our address is 781 Höfn í Hornafirði, Iceland, and there's a contact form on the [contact page](/contact). We're also on Facebook, Instagram (mrkx.labs) and LinkedIn."],
      chips: [{ t: "Send to the team", go: "handoff_start" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "location", kind: "question", kw: ["where are you based", "location", "based in", "iceland", "reykjavik", "höfn", "hofn", "remote", "abroad", "outside iceland", "international", "worldwide", "nationwide", "all over iceland", "akureyri"],
      a: ["We're based in Höfn í Hornafirði and work with businesses across Iceland. We also work remotely, so location isn't a limit for projects."],
      chips: [{ t: "What do you offer?", go: "services" }, { t: "Contact", go: "contact" }] },

    { id: "portfolio", kind: "question", kw: ["portfolio", "examples", "example of your work", "previous work", "past work", "case study", "case studies", "references", "clients", "work you have done", "showcase", "road1tow"],
      a: ["Our publicly shown project is Road1tow, with a case study and the live site. You can see it on our [portfolio page](/portfolio). We're a young studio, and we'd rather show a few things we stand behind than a long list."],
      chips: [{ t: "How do you work?", go: "process" }, { t: "Free analysis", go: "free_analysis" }] },

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

    { id: "local_seo", kind: "faq", kw: ["local seo", "google business profile", "google maps", "google my business", "near me", "local search", "reviews"],
      a: ["Local SEO improves your visibility and trust for location-based searches by aligning your website, your Google Business Profile, reviews and business details. A Google Business Profile alone isn't enough, because your website has to reinforce the same information."],
      chips: [{ t: "SEO service", go: "svc_seo" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "new_ranking", kind: "faq", kw: ["will a new website rank", "new website rank", "automatically rank", "new site rank", "will my site rank", "get found on google", "show up on google"],
      a: ["Not automatically. A well-built site gives search engines a better starting point, but rankings also depend on content, competition, authority and ongoing optimisation."],
      chips: [{ t: "SEO service", go: "svc_seo" }, { t: "Free analysis", go: "free_analysis" }] },

    { id: "builder_seo", kind: "faq", kw: ["website builder", "site builder", "drag and drop", "does wix hurt seo", "builder hurt seo", "no code seo", "template seo"],
      a: ["Not automatically. Website builders can support SEO, but the result depends on correct configuration, crawlable content, proper metadata and internal linking."],
      chips: [{ t: "Free analysis", go: "free_analysis" }] },

    { id: "website_edit", kind: "faq", kw: ["edit the website myself", "edit it myself", "update the website myself", "edit my site", "change content myself", "update content", "can i edit", "cms access", "manage content"],
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

    { id: "howstart", kind: "question", kw: ["get started", "start a project", "start my project", "begin", "how do i start", "next step", "where do i start", "ready to start", "let's start", "start your project", "work with you", "hire you"],
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

    { id: "legal_tax", kind: "rule", kw: ["legal advice", "lawyer", "attorney", "tax advice", "accountant", "gdpr compliant", "gdpr compliance", "is it legal", "sue", "liability", "contract law", "compliance"],
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
    { key: "startup", words: ["startup", "start-up", "new business", "starting", "launch", "idea", "founder", "new company"], line: "For a new business, the first priority is a clear offer and a page that explains it fast, before adding anything else." },
    { key: "pro", words: ["consultant", "consulting", "agency", "lawyer", "accountant", "coach", "freelancer", "designer", "photographer", "studio", "clinic", "salon", "gym"], line: "For professional services, trust signals and a clear explanation of what you do are what turns visitors into enquiries." }
  ];

  return { intents: intents, links: links, priceWeb: P_WEB, priceSeo: P_SEO,
           fallbackFirst: fallbackFirst, fallbackSecond: fallbackSecond, bizMap: bizMap };
})();

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
    maxLen: 500
  };
  var user = window.MRKX_CHAT_CONFIG || {};
  for (var k in user) if (Object.prototype.hasOwnProperty.call(user, k)) CFG[k] = user[k];

  var PAGE_IS = /^\/is(\/|$)/.test(location.pathname);

  /* ---------- strings ---------- */
  var STR = {
    en: {
      title: "MRKX Assistant", sub: "Automated assistant", ph: "Type your message…", send: "Send",
      open: "Open chat", close: "Close chat", renew: "New conversation", renewQ: "Start a new conversation? This clears the current one.", renewYes: "Start over", renewNo: "Keep chatting", note: "Automated assistant. Your messages are only sent to our team if you ask us to.",
      welcome: "Hi! I'm MRKX Assistant, an automated assistant for MRKX Labs (not a person). I can explain our services, answer common questions and set up a free website and search analysis. If I can't help, I'll pass your question to our team.",
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
      welcome: "Halló! Ég er sjálfvirkur aðstoðarmaður MRKX Labs. Ég svara sem stendur á ensku, en ég get líka sent spurninguna þína áfram til teymisins okkar. Hvað get ég gert fyrir þig?",
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

  var CSS = [
    ":host{all:initial}",
    "*{box-sizing:border-box;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}",
    ".launcher{position:fixed;right:var(--lr,20px);bottom:var(--lb,20px);width:58px;height:58px;border-radius:50%;border:1px solid rgba(96,165,250,.55);background:linear-gradient(180deg,rgba(96,165,250,.55),rgba(37,99,235,.35));color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 10px 30px rgba(0,0,0,.4),0 0 0 4px rgba(96,165,250,.12);-webkit-backdrop-filter:blur(18px) saturate(140%);backdrop-filter:blur(18px) saturate(140%);z-index:2147483647;transition:transform .15s ease,background .15s ease}",
    ".launcher:hover{background:linear-gradient(180deg,rgba(96,165,250,.7),rgba(37,99,235,.5));transform:translateY(-1px)}",
    ".launcher:focus-visible,.chip:focus-visible,.send:focus-visible,.x:focus-visible,textarea:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}",
    ".launcher svg{width:26px;height:26px}",
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
    "@media (max-width:520px){textarea{font-size:16px}.panel{right:8px;left:8px;bottom:calc(var(--lb,14px) + 66px);width:auto;max-width:none;height:min(72vh,560px)}.launcher{right:var(--lr,14px);bottom:var(--lb,14px)}}",
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
    root.querySelector(".cn").addEventListener("click", function () { cf.hidden = true; elInput.focus(); });
    root.querySelector(".cy").addEventListener("click", function () { cf.hidden = true; restart(); });
    elForm.addEventListener("submit", function (e) { e.preventDefault(); submit(); });
    elInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
    });
    /* Line the launcher up with the site's cookie-preferences button (same vertical centre, mirrored side inset). */
    var cookieBtn = null, tries = 0;
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
      var vh = document.documentElement.clientHeight;
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
    window.addEventListener("resize", function () { try { alignToCookie(); } catch (e) {} });
    [1500, 3500, 7000, 12000].forEach(function (ms) { setTimeout(function () { try { alignToCookie(); } catch (e) {} }, ms); });
    if (window.ResizeObserver) { try { new ResizeObserver(function () { try { alignToCookie(); } catch (e) {} }).observe(document.documentElement); } catch (e) {} }
    window.addEventListener("orientationchange", function () { setTimeout(function () { try { alignToCookie(); } catch (e) {} }, 400); });
    /* On phones the on-screen keyboard shrinks the visual viewport: fit the panel into what is visible. */
    var vv = window.visualViewport, mq = window.matchMedia ? window.matchMedia("(max-width:520px)") : null;
    function fit() {
      if (!vv || !mq) return;
      var kb = mq.matches && S.open && vv.height < window.innerHeight * 0.8;
      if (kb) {
        elPanel.style.top = (vv.offsetTop + 8) + "px";
        elPanel.style.bottom = "auto";
        elPanel.style.height = Math.max(240, vv.height - 16) + "px";
        elLauncher.style.display = "none";
        scrollEnd();
      } else {
        elPanel.style.top = elPanel.style.bottom = elPanel.style.height = "";
        elLauncher.style.display = "";
      }
    }
    if (vv) { vv.addEventListener("resize", fit); vv.addEventListener("scroll", fit); }
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
    if (S.open) {
      if (!S.greeted) { S.greeted = true; welcome(); }
      setTimeout(function () { elInput.focus(); scrollEnd(); }, 30);
    }
    save();
  }
  function scrollEnd() { elLog.scrollTop = elLog.scrollHeight; }
  function addBubble(role, text) {
    var d = document.createElement("div");
    d.className = "m " + (role === "u" ? "u" : "b");
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
    setTimeout(function () { elInput.focus(); }, 30);
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
    elInput.value = "";
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
    if (chip && chip.go) { if (String(chip.go).indexOf("q:") !== 0) dropAwaiting(); return route(chip.go); }

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
    if (/^(more|tell me more|go on|details|elaborate|and|continue|why|really|can you elaborate|more info|more information)$/.test(words(raw))) {
      if (S.lastMore) { var mt = S.lastMore; S.lastMore = null; return finish(nameLine + mt, [{ t: "Free analysis", go: "free_analysis" }, { t: "Book a consultation", go: "consultation" }], null, true); }
      return say(nameLine + T("moreNone"), [{ t: "Services", go: "services" }, { t: "Pricing", go: "pricing" }, { t: "Free analysis", go: "free_analysis" }]);
    }

    // 4b. business type mentioned in passing ("I run a small cafe")
    if (!S.slots.biz && /\b(i run|i own|we run|we own|my (small |little |new )?(business|company|shop|cafe|café|restaurant|store|studio|hotel)|i have a (small |little )?(business|company|shop|cafe|café|restaurant|store|studio|hotel)|for my)\b/i.test(raw)) {
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
    if (best && best.sc >= 1.5) {
      S.fails = 0;
      if (best.it.kind === "topic") S.topic = best.it.topic;
      var msgTopic = topicOf(M);
      return route(best.it.id, { msgTopic: msgTopic, prefix: nameLine });
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
    if (id === "pricing") return finish((opt.prefix || "") + priceText(opt.msgTopic || S.topic), priceChips(), { id: "pricing", kind: "question" });
    if (id === "human" && S.lang === "is") { S.pending = "handoff"; return say(T("askHandoff"), [{ t: T("yes"), go: "handoff_start" }, { t: T("notNow"), go: "decline" }]); }
    var it = byId(id);
    if (!it) return say(T("moreNone"));
    return finish((opt.prefix || "") + pick(it.a, it.id), it.chips, it);
  }

  function priceText(topic) {
    var w = KB.priceWeb, s = KB.priceSeo;
    if (topic === "website") return "Our Business Website projects start from " + w + " plus VAT. The final price depends on the number of pages, languages, integrations and content, so the best next step is a short consultation, where we shape the price around your project.";
    if (topic === "seo") return "Our Search Foundation work starts from " + s + " plus VAT. What you need beyond that depends on your site and goals, so we shape the scope and the price in a short consultation.";
    if (topic === "landing" || topic === "brand" || topic === "automation" || topic === "app") return "That one is priced per project, because the scope varies a lot. In a short consultation we look at your goals and give you a clear price for it. For reference, our published starting prices are " + w + " for a Business Website and " + s + " for Search Foundation, both plus VAT.";
    return "We have two published starting prices: Business Website from " + w + " and Search Foundation from " + s + ", both plus VAT. Everything else (landing pages, automation, apps, brand systems) is priced per project. The best way to get a real price is a short consultation, where we shape the scope around your goals.";
  }
  function priceChips() { return [{ t: "Book a consultation", go: "consultation" }, { t: "Free analysis", go: "free_analysis" }]; }

  /* finish an answer: set memory, pending, qualification, CTA */
  function finish(text, chips, it, noCount) {
    var id = it && it.id;
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
