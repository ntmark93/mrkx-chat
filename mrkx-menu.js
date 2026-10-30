/* MRKX Labs - custom mobile menu (full-screen glass overlay).
 * Replaces the built-in dropdown: the existing hamburger button stays, its click is
 * taken over here; the built-in menu container is hidden. EN + IS (path prefix /is). */
(function () {
  "use strict";
  if (window.__mrkxMenu) return;
  window.__mrkxMenu = true;

  var TOGGLE = "#MENU_AS_CONTAINER_TOGGLE";
  var ORIGIN = location.origin;
  var MAIL = "hello@mrkxlabs.com";
  var SOCIAL = [
    ["Instagram", "https://www.instagram.com/mrkx.labs"],
    ["LinkedIn", "https://www.linkedin.com/company/mrkxlabs"],
    ["Facebook", "https://www.facebook.com/mrkxlabs"]
  ];

  var COPY = {
    en: {
      prefix: "",
      open: "Open navigation menu", close: "Close navigation menu", nav: "Site", kicker: "Navigation",
      langLabel: "Language", langs: ["English", "Íslenska"], ext: "Opens in a new tab", foot: "MRKX Labs · Iceland",
      items: [
        { t: "Home", p: "/" },
        { t: "Services", p: "/services", sub: [
          { t: "All services", d: "Overview", p: "/services" },
          { t: "Landing Pages", d: "Pages built to convert", p: "/services/landing-page" },
          { t: "Websites", d: "Website development", p: "/services/websites" },
          { t: "Automation", d: "Automation systems", p: "/services/automation-systems" },
          { t: "Mobile Apps", d: "App design & development", p: "/services/mobile-app-design-development" },
          { t: "Brand System", d: "Identity & guidelines", p: "/services/brand-system" },
          { t: "SEO", d: "SEO strategy", p: "/services/seo" }
        ] },
        { t: "Portfolio", p: "/portfolio", m: "/portfolio", sub: [
          { t: "All projects", d: "Overview", p: "/portfolio" },
          { t: "Road1Tow", d: "Case study", p: "/portfolio-case-study-road1tow" },
          { t: "Road1Tow live site", d: "Opens in a new tab", x: "https://www.road1tow.is" }
        ] },
        { t: "About", p: "/about" },
        { t: "Contact", p: "/contact" }
      ]
    },
    is: {
      prefix: "/is",
      open: "Opna valmynd", close: "Loka valmynd", nav: "Vefur", kicker: "Valmynd",
      langLabel: "Tungumál", langs: ["English", "Íslenska"], ext: "Opnast í nýjum glugga", foot: "MRKX Labs · Ísland",
      items: [
        { t: "Heim", p: "/" },
        { t: "Þjónusta", p: "/services", sub: [
          { t: "Öll þjónusta", d: "Yfirlit", p: "/services" },
          { t: "Lendingarsíður", d: "Síður sem skila árangri", p: "/services/landing-page" },
          { t: "Vefsíður", d: "Vefsíðugerð", p: "/services/websites" },
          { t: "Sjálfvirkni", d: "Sjálfvirk kerfi", p: "/services/automation-systems" },
          { t: "Smáforrit", d: "Hönnun og þóun", p: "/services/mobile-app-design-development" },
          { t: "Vörumerki", d: "Vörumerkjakerfi", p: "/services/brand-system" },
          { t: "SEO", d: "Leitarvélabestun", p: "/services/seo" }
        ] },
        { t: "Verkefni", p: "/portfolio", m: "/portfolio", sub: [
          { t: "Öll verkefni", d: "Yfirlit", p: "/portfolio" },
          { t: "Road1Tow", d: "Dæmisaga", p: "/portfolio-case-study-road1tow" },
          { t: "Road1Tow vefsíða", d: "Opnast í nýjum glugga", x: "https://www.road1tow.is" }
        ] },
        { t: "Um", p: "/about" },
        { t: "Samband", p: "/contact" }
      ]
    }
  };

  var CSS = [
    "html.mrkx-nm-on #MENU_AS_CONTAINER{display:none!important}",
    "html.mrkx-nm-open,html.mrkx-nm-open body{overflow:hidden!important}",
    /* keep the header (and the toggle inside it) above the overlay */
    "html.mrkx-nm-open #SITE_HEADER{z-index:100001!important}",
    /* chat launcher and consent UI step aside while the menu is open */
    "[data-mrkx-chat],#usercentrics-cmp-ui,#usercentrics-root{transition:opacity .2s ease,visibility 0s linear 0s}",
    "html.mrkx-nm-open [data-mrkx-chat],html.mrkx-nm-open #usercentrics-cmp-ui,html.mrkx-nm-open #usercentrics-root{",
    "opacity:0!important;visibility:hidden!important;pointer-events:none!important}",
    /* overlay: slightly translucent glass */
    "#mrkx-nm{position:fixed;inset:0;z-index:100000;visibility:hidden;opacity:0;pointer-events:none;",
    "transition:opacity .3s ease,visibility 0s linear .3s;overflow-y:auto;overscroll-behavior:contain;",
    "-webkit-overflow-scrolling:touch;color:#fff;font-family:inherit;-webkit-font-smoothing:antialiased;",
    "-webkit-text-size-adjust:100%;text-rendering:optimizeLegibility;",
    "background:radial-gradient(90% 38% at 100% 0%,rgba(59,130,246,.26) 0%,rgba(59,130,246,0) 70%),",
    "radial-gradient(80% 34% at 0% 100%,rgba(99,102,241,.16) 0%,rgba(99,102,241,0) 70%),",
    "linear-gradient(165deg,rgba(8,12,22,.86) 0%,rgba(14,22,40,.84) 55%,rgba(24,34,56,.86) 100%);",
    "-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%)}",
    "#mrkx-nm.on{visibility:visible;opacity:1;pointer-events:auto;transition:opacity .3s ease,visibility 0s}",
    "#mrkx-nm .in{box-sizing:border-box;min-height:100%;padding:96px 28px calc(36px + env(safe-area-inset-bottom,0px));",
    "padding-left:max(28px,env(safe-area-inset-left,0px));padding-right:max(28px,env(safe-area-inset-right,0px));",
    "display:flex;flex-direction:column}",
    "#mrkx-nm ul{list-style:none;margin:0;padding:0}",
    /* reveal helper */
    "#mrkx-nm .rv{opacity:0;transform:translateY(14px);transition:opacity .45s ease,transform .45s cubic-bezier(.2,.7,.2,1)}",
    "#mrkx-nm.on .rv{opacity:1;transform:none}",
    "#mrkx-nm.on .rv:nth-child(1){transition-delay:.06s}#mrkx-nm.on .rv:nth-child(2){transition-delay:.11s}",
    "#mrkx-nm.on .rv:nth-child(3){transition-delay:.16s}#mrkx-nm.on .rv:nth-child(4){transition-delay:.21s}",
    "#mrkx-nm.on .rv:nth-child(5){transition-delay:.26s}",
    "#mrkx-nm .kick{display:flex;align-items:center;gap:12px;margin:0 0 14px;font-size:10.5px;letter-spacing:.28em;",
    "text-transform:uppercase;color:rgba(148,163,184,.9)}",
    "#mrkx-nm .kick:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(96,165,250,.55),rgba(96,165,250,0))}",
    "#mrkx-nm .top>li{position:relative}",
    "#mrkx-nm .top>li:after{content:'';position:absolute;left:0;right:0;bottom:0;height:1px;",
    "background:linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.02))}",
    "#mrkx-nm .row{display:flex;align-items:center;width:100%;box-sizing:border-box;padding:17px 0;background:none;",
    "border:0;margin:0;color:#fff;text-decoration:none;font:inherit;font-size:29px;line-height:1.1;",
    "letter-spacing:-.015em;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;",
    "-webkit-appearance:none;appearance:none;border-radius:0}",
    "#mrkx-nm .row .n{font-size:10.5px;letter-spacing:.18em;color:rgba(148,163,184,.75);width:30px;flex:none;",
    "font-variant-numeric:tabular-nums;padding-top:3px}",
    "#mrkx-nm .row .l{flex:1;min-width:0;transition:color .2s ease,transform .25s ease}",
    "#mrkx-nm .row:active .l{color:#8fb4ff;transform:translateX(4px)}",
    "#mrkx-nm .cur>.row .l{color:#8fb4ff}",
    "#mrkx-nm .cur>.row .n{color:#8fb4ff}",
    "#mrkx-nm .cur>.row .l:after{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;margin-left:12px;",
    "vertical-align:middle;background:#60a5fa;box-shadow:0 0 12px 2px rgba(96,165,250,.7)}",
    "#mrkx-nm .chev{width:8px;height:8px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;",
    "transform:rotate(45deg);margin:0 8px 4px 12px;transition:transform .3s ease,opacity .2s;opacity:.55;flex:none}",
    "#mrkx-nm .open>.row .chev{transform:rotate(-135deg);margin-bottom:-3px;opacity:.9}",
    "#mrkx-nm .sub{max-height:0;overflow:hidden;transition:max-height .4s cubic-bezier(.2,.7,.2,1)}",
    "#mrkx-nm .sub ul{padding:2px 0 18px 30px;position:relative}",
    "#mrkx-nm .sub ul:before{content:'';position:absolute;left:4px;top:6px;bottom:22px;width:1px;",
    "background:linear-gradient(180deg,rgba(96,165,250,.7),rgba(96,165,250,.05))}",
    "#mrkx-nm .sub a{display:flex;align-items:center;justify-content:space-between;padding:10px 0;color:#fff;",
    "text-decoration:none;-webkit-tap-highlight-color:transparent}",
    "#mrkx-nm .sub a span{min-width:0}",
    "#mrkx-nm .sub a b{display:block;font-weight:400;font-size:18px;line-height:1.2;letter-spacing:-.005em;transition:color .2s}",
    "#mrkx-nm .sub a i{display:block;font-style:normal;font-size:11.5px;color:rgba(148,163,184,.95);margin-top:3px;letter-spacing:.04em}",
    "#mrkx-nm .sub a:after{content:'\\2192';color:rgba(148,163,184,.55);font-size:15px;margin-left:12px;flex:none;transition:transform .2s,color .2s}",
    "#mrkx-nm .sub a.x:after{content:'\\2197'}",
    "#mrkx-nm .sub a.cur b{color:#8fb4ff}",
    "#mrkx-nm .sub a:active b{color:#8fb4ff}#mrkx-nm .sub a:active:after{transform:translateX(3px);color:#8fb4ff}",
    /* language selector: fully custom, no native controls */
    "#mrkx-nm .lang{margin-top:34px}",
    "#mrkx-nm .lg{position:relative;display:grid;grid-template-columns:1fr 1fr;width:188px;box-sizing:border-box;padding:3px;",
    "border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);",
    "box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}",
    "#mrkx-nm .lg:before{content:'';position:absolute;top:3px;bottom:3px;left:3px;width:calc(50% - 3px);border-radius:999px;",
    "background:linear-gradient(180deg,#3b82f6 0%,#2158d6 100%);box-shadow:0 4px 18px rgba(37,99,235,.55),inset 0 1px 0 rgba(255,255,255,.35);",
    "transition:transform .3s cubic-bezier(.2,.7,.2,1)}",
    "#mrkx-nm .lg[data-l=is]:before{transform:translateX(100%)}",
    "#mrkx-nm .lg a{position:relative;display:block;box-sizing:border-box;text-align:center;padding:8px 0 7px;border-radius:999px;",
    "color:rgba(255,255,255,.62);text-decoration:none;-webkit-tap-highlight-color:transparent;line-height:1}",
    "#mrkx-nm .lg a b{display:block;font-weight:600;font-size:14px;letter-spacing:.14em;text-indent:.14em}",
    "#mrkx-nm .lg a i{display:block;font-style:normal;font-size:9.5px;letter-spacing:.06em;margin-top:4px;opacity:.8}",
    "#mrkx-nm .lg a[aria-current=true]{color:#fff}",
    /* footer */
    "#mrkx-nm .foot{margin-top:auto;padding-top:38px}",
    "#mrkx-nm .foot a{color:rgba(226,232,240,.92);text-decoration:none;-webkit-tap-highlight-color:transparent}",
    "#mrkx-nm .mail{display:inline-block;font-size:15px;letter-spacing:.01em;padding:6px 0;border-bottom:1px solid rgba(96,165,250,.5)}",
    "#mrkx-nm .soc{display:flex;gap:20px;margin:18px 0 0;font-size:11px;letter-spacing:.16em;text-transform:uppercase}",
    "#mrkx-nm .soc a{color:rgba(148,163,184,.95)}",
    "#mrkx-nm .tag{margin:22px 0 0;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:rgba(100,116,139,.95)}",
    /* hamburger -> X on the existing toggle */
    TOGGLE + "{position:relative}",
    "html.mrkx-nm-on " + TOGGLE + " .vlJDcR{transition:opacity .15s ease}",
    "html.mrkx-nm-on.mrkx-nm-open " + TOGGLE + " .vlJDcR{opacity:0}",
    "html.mrkx-nm-on " + TOGGLE + "::before,html.mrkx-nm-on " + TOGGLE + "::after{content:'';position:absolute;",
    "left:50%;top:50%;width:20px;height:2px;margin:-1px 0 0 -10px;background:#0b0f19;border-radius:2px;opacity:0;",
    "transition:transform .3s ease,opacity .15s ease;pointer-events:none}",
    "html.mrkx-nm-open " + TOGGLE + "::before{opacity:1;transform:rotate(45deg)}",
    "html.mrkx-nm-open " + TOGGLE + "::after{opacity:1;transform:rotate(-45deg)}",
    "@media (prefers-reduced-motion:reduce){#mrkx-nm,#mrkx-nm *{transition:none!important}}"
  ].join("");

  function lang() { return /^\/is(\/|$)/.test(location.pathname) ? "is" : "en"; }
  function stripLang(p) { return p.replace(/^\/is(?=\/|$)/, "") || "/"; }
  function norm(p) { return (p || "/").replace(/\/+$/, "") || "/"; }
  function href(c, p) { return ORIGIN + (c.prefix + (p === "/" ? "" : p) || "/"); }

  var root, toggle, lastFocus, isOpen = false;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function build() {
    var L = lang(), c = COPY[L], cur = norm(stripLang(location.pathname));
    if (!root) {
      root = el("div"); root.id = "mrkx-nm"; root.setAttribute("role", "dialog");
      root.setAttribute("aria-modal", "true");
      document.body.appendChild(root);
      root.addEventListener("click", onPanelClick);
    }
    root.setAttribute("aria-label", c.nav);
    root.textContent = "";
    var inn = el("div", "in"), nav = el("nav"), ul = el("ul", "top");
    nav.setAttribute("aria-label", c.nav);
    var kick = el("p", "kick rv", c.kicker);
    nav.appendChild(kick);
    c.items.forEach(function (it, i) {
      var li = el("li", "rv"), n = el("span", "n", ("0" + (i + 1)).slice(-2)), lab = el("span", "l", it.t);
      var m = it.m || it.p;
      var isCur = it.p === "/" ? cur === "/" : (cur === it.p || cur.indexOf(m) === 0 && (it.m || cur.charAt(m.length) === "/"));
      if (isCur) li.className += " cur";
      if (it.sub) {
        var b = el("button", "row"); b.type = "button"; b.setAttribute("aria-expanded", "false");
        b.appendChild(n); b.appendChild(lab); b.appendChild(el("span", "chev"));
        var sub = el("div", "sub"), sul = el("ul");
        it.sub.forEach(function (s) {
          var sl = el("li"), a = el("a"), tx = el("span");
          tx.appendChild(el("b", null, s.t)); tx.appendChild(el("i", null, s.d));
          a.appendChild(tx);
          if (s.x) { a.href = s.x; a.target = "_blank"; a.rel = "noopener"; a.className = "x"; }
          else { a.href = href(c, s.p); if (norm(s.p) === cur) a.className = "cur"; }
          sl.appendChild(a); sul.appendChild(sl);
        });
        sub.appendChild(sul); li.appendChild(b); li.appendChild(sub);
        if (isCur) li.setAttribute("data-auto", "1");
      } else {
        var a2 = el("a", "row"); a2.href = href(c, it.p); a2.appendChild(n); a2.appendChild(lab);
        li.appendChild(a2);
      }
      ul.appendChild(li);
    });
    nav.appendChild(ul); inn.appendChild(nav);

    var lg = el("div", "lang rv"), box = el("div", "lg");
    box.setAttribute("role", "group"); box.setAttribute("aria-label", c.langLabel); box.setAttribute("data-l", L);
    var rest = stripLang(location.pathname) + location.search + location.hash;
    [["EN", "en", c.langs[0]], ["IS", "is", c.langs[1]]].forEach(function (x) {
      var a = el("a"); a.lang = x[1]; a.hreflang = x[1];
      a.appendChild(el("b", null, x[0])); a.appendChild(el("i", null, x[2]));
      a.href = ORIGIN + (x[1] === "is" ? "/is" + (rest === "/" ? "" : rest) : rest);
      a.setAttribute("aria-current", L === x[1] ? "true" : "false");
      box.appendChild(a);
    });
    lg.appendChild(box); inn.appendChild(lg);

    var ft = el("div", "foot rv"), mail = el("a", "mail", MAIL), soc = el("div", "soc");
    mail.href = "mailto:" + MAIL;
    SOCIAL.forEach(function (s) { var a = el("a", null, s[0]); a.href = s[1]; a.target = "_blank"; a.rel = "noopener"; soc.appendChild(a); });
    ft.appendChild(mail); ft.appendChild(soc); ft.appendChild(el("p", "tag", c.foot));
    inn.appendChild(ft);
    root.appendChild(inn);
  }

  function setSub(li, open) {
    var sub = li.querySelector(".sub"), b = li.querySelector("button");
    if (!sub) return;
    li.classList.toggle("open", open);
    b.setAttribute("aria-expanded", open ? "true" : "false");
    sub.style.maxHeight = open ? sub.scrollHeight + "px" : "0px";
  }

  function onPanelClick(e) {
    var b = e.target.closest && e.target.closest("button.row");
    if (b) {
      var li = b.parentNode, willOpen = !li.classList.contains("open");
      // one section open at a time
      [].forEach.call(root.querySelectorAll(".top>li.open"), function (o) { if (o !== li) setSub(o, false); });
      setSub(li, willOpen); return;
    }
    var a = e.target.closest && e.target.closest("a[href]");
    if (a) {
      if (a.target === "_blank" || /^mailto:/.test(a.href)) return;
      var u = new URL(a.href);
      if (u.pathname === location.pathname && u.search === location.search) { e.preventDefault(); close(); }
      else setTimeout(close, 60);
    }
  }

  function refreshToggle() {
    if (!toggle) return;
    var c = COPY[lang()];
    toggle.setAttribute("aria-label", isOpen ? c.close : c.open);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-controls", "mrkx-nm");
  }

  function open() {
    if (isOpen) return;
    toggle = document.querySelector(TOGGLE);
    build();
    lastFocus = document.activeElement;
    isOpen = true;
    document.documentElement.classList.add("mrkx-nm-open");
    root.getBoundingClientRect();
    root.classList.add("on");
    root.scrollTop = 0;
    [].forEach.call(root.querySelectorAll(".top>li[data-auto]"), function (li) { setSub(li, true); });
    refreshToggle();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("on");
    document.documentElement.classList.remove("mrkx-nm-open");
    refreshToggle();
    try { if (lastFocus && lastFocus.focus && toggle && toggle.contains(lastFocus)) toggle.focus({ preventScroll: true }); } catch (e) {}
  }

  function onToggleEvent(e) {
    var t = e.target && e.target.closest && e.target.closest(TOGGLE);
    if (!t) return;
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if (e.type === "keydown" && e.repeat) return;
    isOpen ? close() : open();
  }

  function init() {
    var st = document.createElement("style");
    st.id = "mrkx-nm-css"; st.textContent = CSS; document.head.appendChild(st);
    document.documentElement.classList.add("mrkx-nm-on");
    window.addEventListener("click", onToggleEvent, true);
    window.addEventListener("keydown", onToggleEvent, true);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen) close(); });
    // leaving the mobile layout (toggle disappears) closes the overlay
    window.addEventListener("resize", function () {
      var t = document.querySelector(TOGGLE);
      if (isOpen && (!t || !t.offsetParent)) close();
    });
    window.addEventListener("pageshow", function () { if (isOpen) close(); });
    // keep the label in sync after Wix re-renders the toggle
    new MutationObserver(function () {
      var t = document.querySelector(TOGGLE);
      if (t && t !== toggle) { toggle = t; refreshToggle(); }
      else if (t && t.getAttribute("aria-label") !== COPY[lang()][isOpen ? "close" : "open"]) refreshToggle();
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-label"] });
    toggle = document.querySelector(TOGGLE);
    refreshToggle();
  }

  if (document.body) init(); else document.addEventListener("DOMContentLoaded", init);
})();
