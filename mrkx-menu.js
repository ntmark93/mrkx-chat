/* MRKX Labs - custom mobile menu (full-screen overlay).
 * Replaces the built-in dropdown: the existing hamburger button stays, its click is
 * taken over here; the built-in menu container is hidden. EN + IS (path prefix /is). */
(function () {
  "use strict";
  if (window.__mrkxMenu) return;
  window.__mrkxMenu = true;

  var TOGGLE = "#MENU_AS_CONTAINER_TOGGLE";
  var ORIGIN = location.origin;
  var OUT_MS = 520; // length of the closing animation

  var COPY = {
    en: {
      prefix: "",
      open: "Open navigation menu", close: "Close navigation menu", nav: "Site",
      langLabel: "Language", mail: "hello@mrkxlabs.com",
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
        { t: "Portfolio", p: "/portfolio", pre: true, sub: [
          { t: "All projects", d: "Overview", p: "/portfolio" },
          { t: "ROAD1 TOW", d: "Website & digital foundation", p: "/portfolio-case-study-road1tow" }
        ] },
        { t: "About", p: "/about" },
        { t: "Contact", p: "/contact" }
      ]
    },
    is: {
      prefix: "/is",
      open: "Opna valmynd", close: "Loka valmynd", nav: "Vefur",
      langLabel: "Tungumál", mail: "hello@mrkxlabs.com",
      items: [
        { t: "Heim", p: "/" },
        { t: "Þjónusta", p: "/services", sub: [
          { t: "Öll þjónusta", d: "Yfirlit", p: "/services" },
          { t: "Lendingarsíður", d: "Síður sem skila árangri", p: "/services/landing-page" },
          { t: "Vefsíður", d: "Vefsíðugerð", p: "/services/websites" },
          { t: "Sjálfvirkni", d: "Sjálfvirk kerfi", p: "/services/automation-systems" },
          { t: "Smáforrit", d: "Hönnun og þróun", p: "/services/mobile-app-design-development" },
          { t: "Vörumerki", d: "Vörumerkjakerfi", p: "/services/brand-system" },
          { t: "SEO", d: "Leitarvélabestun", p: "/services/seo" }
        ] },
        { t: "Verkefni", p: "/portfolio", pre: true, sub: [
          { t: "Öll verkefni", d: "Yfirlit", p: "/portfolio" },
          { t: "ROAD1 TOW", d: "Vefsíða og stafrænn grunnur", p: "/portfolio-case-study-road1tow" }
        ] },
        { t: "Um", p: "/about" },
        { t: "Samband", p: "/contact" }
      ]
    }
  };

  var T = TOGGLE, H = "html.mrkx-nm-open ";
  var CSS = [
    "html.mrkx-nm-on #MENU_AS_CONTAINER{display:none!important}",
    "html.mrkx-nm-open,html.mrkx-nm-open body{overflow:hidden!important}",
    /* header (with the toggle) stays above the overlay */
    H + "#SITE_HEADER{z-index:100001!important}",
    /* chat launcher + consent UI are hidden while the menu is open (fade both ways) */
    "[data-mrkx-chat],#usercentrics-root,#usercentrics-cmp-ui{transition:opacity .3s ease,visibility 0s linear 0s}",
    H + "[data-mrkx-chat]," + H + "#usercentrics-root," + H + "#usercentrics-cmp-ui{opacity:0!important;",
    "visibility:hidden!important;pointer-events:none!important;transition:opacity .25s ease,visibility 0s linear .25s}",

    "#mrkx-nm{position:fixed;inset:0;z-index:100000;visibility:hidden;opacity:0;pointer-events:none;",
    "overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;color:#fff;font-family:inherit;",
    "-webkit-text-size-adjust:100%;text-size-adjust:100%;",
    "background:radial-gradient(90% 45% at 100% 0%,rgba(59,130,246,.20) 0%,rgba(59,130,246,0) 70%),",
    "radial-gradient(80% 40% at 0% 100%,rgba(37,99,235,.14) 0%,rgba(37,99,235,0) 70%),",
    "linear-gradient(165deg,rgba(8,12,22,.90) 0%,rgba(14,22,40,.86) 55%,rgba(24,35,58,.84) 100%);",
    "-webkit-backdrop-filter:blur(10px) saturate(130%);backdrop-filter:blur(10px) saturate(130%);",
    "transition:opacity .35s ease,visibility 0s linear " + (OUT_MS / 1000) + "s}",
    "#mrkx-nm.on{visibility:visible;opacity:1;pointer-events:auto;transition:opacity .35s ease,visibility 0s}",
    "#mrkx-nm.out{visibility:visible;opacity:0;pointer-events:none;transition:opacity .3s ease " + ((OUT_MS - 300) / 1000) + "s,visibility 0s linear " + (OUT_MS / 1000) + "s}",
    "#mrkx-nm .in{box-sizing:border-box;min-height:100%;padding:104px 28px 120px;display:flex;flex-direction:column}",
    "#mrkx-nm ul{list-style:none;margin:0;padding:0}",
    "#mrkx-nm .top>li{position:relative;opacity:0}",
    "#mrkx-nm .top>li::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1px;",
    "background:linear-gradient(90deg,rgba(255,255,255,.16),rgba(255,255,255,.03))}",
    "@keyframes nmIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}",
    "@keyframes nmOut{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-12px)}}",
    "#mrkx-nm.on .top>li{animation:nmIn .5s cubic-bezier(.2,.7,.2,1) both}",
    "#mrkx-nm.on .top>li:nth-child(1){animation-delay:.06s}#mrkx-nm.on .top>li:nth-child(2){animation-delay:.12s}",
    "#mrkx-nm.on .top>li:nth-child(3){animation-delay:.18s}#mrkx-nm.on .top>li:nth-child(4){animation-delay:.24s}",
    "#mrkx-nm.on .top>li:nth-child(5){animation-delay:.30s}",
    "#mrkx-nm.out .top>li{animation:nmOut .3s ease both}",
    "#mrkx-nm.out .top>li:nth-child(5){animation-delay:0s}#mrkx-nm.out .top>li:nth-child(4){animation-delay:.04s}",
    "#mrkx-nm.out .top>li:nth-child(3){animation-delay:.08s}#mrkx-nm.out .top>li:nth-child(2){animation-delay:.12s}",
    "#mrkx-nm.out .top>li:nth-child(1){animation-delay:.16s}",
    "#mrkx-nm .row{display:flex;align-items:center;width:100%;box-sizing:border-box;padding:17px 0;background:none;border:0;",
    "margin:0;color:#fff;text-decoration:none;font:inherit;font-size:29px;font-weight:300;line-height:1.1;",
    "letter-spacing:-.015em;text-align:left;cursor:pointer;-webkit-appearance:none;appearance:none;",
    "-webkit-tap-highlight-color:transparent;transition:color .2s ease}",
    "#mrkx-nm .row .n{font-size:10px;letter-spacing:.18em;color:rgba(148,163,184,.75);width:34px;flex:none;",
    "font-variant-numeric:tabular-nums;transform:translateY(-6px)}",
    "#mrkx-nm .row .l{flex:1;min-width:0}",
    "#mrkx-nm .row:active{color:#8ab4ff}",
    "#mrkx-nm .cur>.row{color:#8ab4ff}",
    "#mrkx-nm .cur>.row .n{color:#8ab4ff}",
    "#mrkx-nm .cur>.row .l::after{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;",
    "background:#8ab4ff;box-shadow:0 0 10px 2px rgba(138,180,255,.7);margin-left:12px;vertical-align:middle;transform:translateY(-2px)}",
    /* plus / minus indicator */
    "#mrkx-nm .pm{position:relative;width:14px;height:14px;flex:none;margin:0 4px 0 12px;opacity:.75}",
    "#mrkx-nm .pm::before,#mrkx-nm .pm::after{content:'';position:absolute;left:0;top:50%;width:14px;height:1.5px;",
    "margin-top:-.75px;background:currentColor;transition:transform .3s ease}",
    "#mrkx-nm .pm::after{transform:rotate(90deg)}",
    "#mrkx-nm .open>.row .pm::after{transform:rotate(0deg)}",
    "#mrkx-nm .sub{max-height:0;overflow:hidden;transition:max-height .4s cubic-bezier(.2,.7,.2,1)}",
    "#mrkx-nm .sub ul{padding:2px 0 18px 34px}",
    "#mrkx-nm .sub a{position:relative;display:block;padding:10px 0 10px 16px;color:#fff;text-decoration:none;",
    "-webkit-tap-highlight-color:transparent}",
    "#mrkx-nm .sub a::before{content:'';position:absolute;left:0;top:12px;bottom:12px;width:1.5px;border-radius:2px;",
    "background:rgba(255,255,255,.14);transition:background .2s ease}",
    "#mrkx-nm .sub a b{display:block;font-weight:400;font-size:18px;line-height:1.2;letter-spacing:-.005em}",
    "#mrkx-nm .sub a i{display:block;font-style:normal;font-size:12px;color:rgba(148,163,184,.95);margin-top:3px;letter-spacing:.03em}",
    "#mrkx-nm .sub a.cur b{color:#8ab4ff}#mrkx-nm .sub a.cur::before{background:#8ab4ff}",
    "#mrkx-nm .sub a:active b{color:#8ab4ff}",
    /* footer: language + mail */
    "#mrkx-nm .foot{margin-top:auto;padding-top:34px;opacity:0}",
    "#mrkx-nm.on .foot{animation:nmIn .5s cubic-bezier(.2,.7,.2,1) .38s both}",
    "#mrkx-nm.out .foot{animation:nmOut .3s ease both}",
    "#mrkx-nm .lang{display:flex;align-items:center;gap:14px}",
    "#mrkx-nm .lang svg{width:18px;height:18px;flex:none;stroke:rgba(147,197,253,.85);fill:none;stroke-width:1.4;",
    "stroke-linecap:round}",
    "#mrkx-nm .seg{position:relative;display:inline-grid;grid-template-columns:1fr 1fr;box-sizing:border-box;",
    "height:40px;width:132px;padding:3px;border-radius:999px;background:rgba(96,165,250,.07);",
    "border:1px solid rgba(96,165,250,.32);box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}",
    "#mrkx-nm .seg .th{position:absolute;top:3px;bottom:3px;left:3px;width:calc(50% - 3px);border-radius:999px;",
    "border:1px solid rgba(96,165,250,.55);box-sizing:border-box;",
    "background:linear-gradient(180deg,rgba(96,165,250,.55),rgba(37,99,235,.38));",
    "transition:transform .32s cubic-bezier(.2,.7,.2,1)}",
    "#mrkx-nm .seg[data-v=is] .th{transform:translateX(100%)}",
    "#mrkx-nm .seg a{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;",
    "color:rgba(255,255,255,.62);text-decoration:none;font:inherit;font-size:13px;font-weight:500;letter-spacing:.14em;",
    "-webkit-tap-highlight-color:transparent;transition:color .25s ease}",
    "#mrkx-nm .seg a[aria-current=true]{color:#fff}",
    "#mrkx-nm .mail{display:block;margin-top:26px;color:rgba(148,163,184,.9);text-decoration:none;font-size:13px;",
    "letter-spacing:.04em;-webkit-tap-highlight-color:transparent}",
    /* desktop: restyle the header's own language selector to match the menu pill */
    "html.mrkx-nm-on #SITE_HEADER [data-testid=language-selector-container],html.mrkx-nm-on #SITE_HEADER [data-testid=language-selector-container] .Q0JjLQ{overflow:visible!important}",
    "html.mrkx-nm-on #SITE_HEADER .wixui-language-menu{position:absolute!important;right:0;top:50%;transform:translateY(-50%);",
    "display:grid!important;grid-template-columns:1fr 1fr;gap:0!important;box-sizing:border-box;height:34px!important;width:112px!important;",
    "padding:3px!important;border-radius:999px!important;background:rgba(96,165,250,.07)!important;",
    "border:1px solid rgba(96,165,250,.32)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}",
    "html.mrkx-nm-on #SITE_HEADER .wixui-language-menu::before{content:'';position:absolute;top:3px;bottom:3px;left:3px;",
    "width:calc(50% - 3px);border-radius:999px;border:1px solid rgba(96,165,250,.55);box-sizing:border-box;",
    "background:linear-gradient(180deg,rgba(96,165,250,.55),rgba(37,99,235,.38));transition:transform .32s cubic-bezier(.2,.7,.2,1)}",
    "html.mrkx-nm-on #SITE_HEADER .wixui-language-menu:has(button:nth-of-type(2)[aria-current=true])::before{transform:translateX(100%)}",
    "html.mrkx-nm-on #SITE_HEADER .wixui-language-menu::after{content:'';position:absolute;right:calc(100% + 10px);top:50%;",
    "width:16px;height:16px;margin-top:-8px;background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2393c5fd' stroke-opacity='.85' stroke-width='1.4' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z'/%3E%3C/svg%3E\") center/contain no-repeat}",
    "html.mrkx-nm-on #SITE_HEADER .wixui-language-menu__option{position:relative;z-index:1;display:flex!important;align-items:center;justify-content:center;",
    "width:auto!important;height:auto!important;min-width:0!important;margin:0!important;padding:0!important;background:none!important;border:0!important;",
    "box-shadow:none!important;border-radius:999px!important;cursor:pointer;-webkit-appearance:none;appearance:none;opacity:1!important}",
    "html.mrkx-nm-on #SITE_HEADER .wixui-language-menu__option *{color:rgba(255,255,255,.62)!important;font-size:12px!important;font-weight:500!important;",
    "letter-spacing:.14em!important;line-height:1!important;text-transform:none!important;transition:color .25s ease}",
    "html.mrkx-nm-on #SITE_HEADER .wixui-language-menu__option[aria-current=true] *{color:#fff!important}",
    /* hamburger -> X on the existing toggle */
    T + "{position:relative}",
    "html.mrkx-nm-on " + T + " .vlJDcR{transition:opacity .2s ease}",
    "html.mrkx-nm-on.mrkx-nm-open " + T + " .vlJDcR{opacity:0}",
    "html.mrkx-nm-on " + T + "::before,html.mrkx-nm-on " + T + "::after{content:'';position:absolute;",
    "left:50%;top:50%;width:20px;height:2px;margin:-1px 0 0 -10px;background:#0b0f19;border-radius:2px;opacity:0;",
    "transition:transform .3s ease,opacity .2s ease;pointer-events:none}",
    "html.mrkx-nm-open " + T + "::before{opacity:1;transform:rotate(45deg)}",
    "html.mrkx-nm-open " + T + "::after{opacity:1;transform:rotate(-45deg)}",
    "@media (prefers-reduced-motion:reduce){#mrkx-nm,#mrkx-nm *{animation-duration:.01s!important;animation-delay:0s!important;transition-duration:.01s!important;transition-delay:0s!important}}"
  ].join("");

  function lang() { return /^\/is(\/|$)/.test(location.pathname) ? "is" : "en"; }
  function stripLang(p) { return p.replace(/^\/is(?=\/|$)/, "") || "/"; }
  function norm(p) { return (p || "/").replace(/\/+$/, "") || "/"; }
  function href(c, p) { return ORIGIN + (c.prefix + (p === "/" ? "" : p) || "/"); }

  var root, toggle, lastFocus, isOpen = false, closeTimer = 0;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/></svg>';

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
    c.items.forEach(function (it, i) {
      var li = el("li"), n = el("span", "n", ("0" + (i + 1)).slice(-2)), lab = el("span", "l", it.t);
      var isCur = it.p === "/" ? cur === "/" : (it.pre ? cur.indexOf(it.p) === 0 : (cur === it.p || cur.indexOf(it.p + "/") === 0));
      if (isCur) li.className = "cur";
      if (it.sub) {
        var b = el("button", "row"); b.type = "button"; b.setAttribute("aria-expanded", "false");
        b.appendChild(n); b.appendChild(lab); b.appendChild(el("span", "pm"));
        var sub = el("div", "sub"), sul = el("ul");
        it.sub.forEach(function (s) {
          var sl = el("li"), a = el("a"), bb = el("b", null, s.t), ii = el("i", null, s.d);
          a.href = href(c, s.p); a.appendChild(bb); a.appendChild(ii);
          if (norm(s.p) === cur) a.className = "cur";
          sl.appendChild(a); sul.appendChild(sl);
        });
        sub.appendChild(sul); li.appendChild(b); li.appendChild(sub);
        if (isCur) li.setAttribute("data-open", "1");
      } else {
        var a2 = el("a", "row"); a2.href = href(c, it.p); a2.appendChild(n); a2.appendChild(lab);
        li.appendChild(a2);
      }
      ul.appendChild(li);
    });
    nav.appendChild(ul); inn.appendChild(nav);

    var foot = el("div", "foot"), lg = el("div", "lang"), seg = el("div", "seg");
    seg.setAttribute("data-v", L); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", c.langLabel);
    var g = el("span"); g.innerHTML = GLOBE; lg.appendChild(g.firstChild);
    seg.appendChild(el("span", "th"));
    var rest = stripLang(location.pathname) + location.search + location.hash;
    [["EN", "en"], ["IS", "is"]].forEach(function (x) {
      var a = el("a", null, x[0]); a.lang = x[1];
      a.href = ORIGIN + (x[1] === "is" ? "/is" + (rest === "/" ? "" : rest) : rest);
      a.setAttribute("data-l", x[1]);
      a.setAttribute("aria-current", L === x[1] ? "true" : "false");
      seg.appendChild(a);
    });
    lg.appendChild(seg); foot.appendChild(lg);
    var mail = el("a", "mail", c.mail); mail.href = "mailto:" + c.mail; foot.appendChild(mail);
    inn.appendChild(foot);
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
      var li = b.parentNode, will = !li.classList.contains("open");
      if (will) [].forEach.call(root.querySelectorAll(".top>li.open"), function (o) { if (o !== li) setSub(o, false); });
      setSub(li, will); return;
    }
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var u = new URL(a.href, location.href);
    if (a.getAttribute("data-l")) {
      // language pill: slide the thumb, then navigate
      if (a.getAttribute("aria-current") === "true") { e.preventDefault(); return; }
      e.preventDefault();
      a.parentNode.setAttribute("data-v", a.getAttribute("data-l"));
      setTimeout(function () { location.href = u.href; }, 260);
      return;
    }
    if (u.protocol === "mailto:") return;
    if (u.pathname === location.pathname && u.search === location.search) { e.preventDefault(); close(); }
    else setTimeout(close, 60);
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
    clearTimeout(closeTimer);
    toggle = document.querySelector(TOGGLE);
    build();
    lastFocus = document.activeElement;
    isOpen = true;
    root.classList.remove("out");
    document.documentElement.classList.add("mrkx-nm-open");
    root.getBoundingClientRect();
    root.classList.add("on");
    root.scrollTop = 0;
    [].forEach.call(root.querySelectorAll(".top>li[data-open]"), function (li) { setSub(li, true); });
    refreshToggle();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("on");
    root.classList.add("out");
    document.documentElement.classList.remove("mrkx-nm-open");
    refreshToggle();
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () { root.classList.remove("out"); }, OUT_MS + 40);
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
    window.addEventListener("resize", function () {
      var t = document.querySelector(TOGGLE);
      if (isOpen && (!t || !t.offsetParent)) close();
    });
    window.addEventListener("pageshow", function () { if (isOpen) close(); });
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
