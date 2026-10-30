/* MRKX Labs - custom mobile menu (full-screen overlay).
 * Replaces the built-in dropdown: the existing hamburger button stays, its click is
 * taken over here; the built-in menu container is hidden. EN + IS (path prefix /is). */
(function () {
  "use strict";
  if (window.__mrkxMenu) return;
  window.__mrkxMenu = true;

  var TOGGLE = "#MENU_AS_CONTAINER_TOGGLE";
  var ORIGIN = location.origin;

  var COPY = {
    en: {
      prefix: "",
      open: "Open navigation menu", close: "Close navigation menu", nav: "Site",
      langLabel: "Language",
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
        { t: "Portfolio", p: "/portfolio" },
        { t: "About", p: "/about" },
        { t: "Contact", p: "/contact" }
      ]
    },
    is: {
      prefix: "/is",
      open: "Opna valmynd", close: "Loka valmynd", nav: "Vefur",
      langLabel: "Tungumál",
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
        { t: "Verkefni", p: "/portfolio" },
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
    "#mrkx-nm{position:fixed;inset:0;z-index:100000;visibility:hidden;opacity:0;pointer-events:none;",
    "transition:opacity .25s ease,visibility 0s linear .25s;overflow-y:auto;overscroll-behavior:contain;",
    "-webkit-overflow-scrolling:touch;color:#fff;font-family:inherit;",
    "background:radial-gradient(120% 60% at 100% 0%,rgba(59,130,246,.22) 0%,rgba(59,130,246,0) 60%),",
    "linear-gradient(160deg,#0b0f19 0%,#111a2e 55%,#1e293b 100%)}",
    "#mrkx-nm.on{visibility:visible;opacity:1;pointer-events:auto;transition:opacity .25s ease,visibility 0s}",
    "#mrkx-nm .in{box-sizing:border-box;min-height:100%;padding:92px 26px 120px;display:flex;flex-direction:column}",
    "#mrkx-nm ul{list-style:none;margin:0;padding:0}",
    "#mrkx-nm .top>li{border-bottom:1px solid rgba(255,255,255,.09);opacity:0;transform:translateY(12px);",
    "transition:opacity .35s ease,transform .35s ease}",
    "#mrkx-nm.on .top>li{opacity:1;transform:none}",
    "#mrkx-nm.on .top>li:nth-child(1){transition-delay:.05s}#mrkx-nm.on .top>li:nth-child(2){transition-delay:.10s}",
    "#mrkx-nm.on .top>li:nth-child(3){transition-delay:.15s}#mrkx-nm.on .top>li:nth-child(4){transition-delay:.20s}",
    "#mrkx-nm.on .top>li:nth-child(5){transition-delay:.25s}",
    "#mrkx-nm .row{display:flex;align-items:center;justify-content:space-between;width:100%;box-sizing:border-box;",
    "padding:16px 0;background:none;border:0;margin:0;color:#fff;text-decoration:none;font:inherit;font-size:28px;",
    "line-height:1.15;letter-spacing:-.01em;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}",
    "#mrkx-nm .row .n{font-size:11px;letter-spacing:.14em;color:rgba(148,163,184,.8);margin-right:14px;",
    "font-variant-numeric:tabular-nums;align-self:flex-start;padding-top:9px}",
    "#mrkx-nm .row .l{flex:1;min-width:0}",
    "#mrkx-nm .row:active{color:#7aa7ff}",
    "#mrkx-nm .cur>.row .l,#mrkx-nm .cur>.row{color:#7aa7ff}",
    "#mrkx-nm .chev{width:10px;height:10px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;",
    "transform:rotate(45deg);margin:0 6px 4px 12px;transition:transform .25s ease;opacity:.8;flex:none}",
    "#mrkx-nm .open>.row .chev{transform:rotate(-135deg);margin-bottom:-4px}",
    "#mrkx-nm .sub{max-height:0;overflow:hidden;transition:max-height .35s ease}",
    "#mrkx-nm .sub ul{padding:0 0 14px 25px;border-left:1px solid rgba(59,130,246,.45);margin-left:5px}",
    "#mrkx-nm .sub a{display:block;padding:9px 0 9px 14px;color:#fff;text-decoration:none;-webkit-tap-highlight-color:transparent}",
    "#mrkx-nm .sub a b{display:block;font-weight:500;font-size:18px;line-height:1.2}",
    "#mrkx-nm .sub a i{display:block;font-style:normal;font-size:12px;color:rgba(148,163,184,.95);margin-top:2px;letter-spacing:.02em}",
    "#mrkx-nm .sub a.cur b{color:#7aa7ff}",
    "#mrkx-nm .sub a:active b{color:#7aa7ff}",
    "#mrkx-nm .lang{margin-top:30px;opacity:0;transition:opacity .4s ease .35s}#mrkx-nm.on .lang{opacity:1}",
    "#mrkx-nm .lang small{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;",
    "color:rgba(148,163,184,.85);margin-bottom:10px}",
    "#mrkx-nm .lang div{display:inline-flex;border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:3px;",
    "background:rgba(255,255,255,.04)}",
    "#mrkx-nm .lang a{min-width:54px;box-sizing:border-box;text-align:center;padding:9px 16px;border-radius:999px;",
    "color:rgba(255,255,255,.75);text-decoration:none;font-size:14px;letter-spacing:.08em;-webkit-tap-highlight-color:transparent}",
    "#mrkx-nm .lang a[aria-current=true]{background:#2563eb;color:#fff}",
    /* hamburger -> X on the existing toggle */
    TOGGLE + "{position:relative}",
    "html.mrkx-nm-on " + TOGGLE + " .vlJDcR{transition:opacity .15s ease}",
    "html.mrkx-nm-on.mrkx-nm-open " + TOGGLE + " .vlJDcR{opacity:0}",
    "html.mrkx-nm-on " + TOGGLE + "::before,html.mrkx-nm-on " + TOGGLE + "::after{content:'';position:absolute;",
    "left:50%;top:50%;width:20px;height:2px;margin:-1px 0 0 -10px;background:#0b0f19;border-radius:2px;opacity:0;",
    "transition:transform .25s ease,opacity .15s ease;pointer-events:none}",
    "html.mrkx-nm-open " + TOGGLE + "::before{opacity:1;transform:rotate(45deg)}",
    "html.mrkx-nm-open " + TOGGLE + "::after{opacity:1;transform:rotate(-45deg)}",
    "@media (prefers-reduced-motion:reduce){#mrkx-nm,#mrkx-nm *{transition:none!important}}"
  ].join("");

  function lang() { return /^\/is(\/|$)/.test(location.pathname) ? "is" : "en"; }
  function stripLang(p) { return p.replace(/^\/is(?=\/|$)/, "") || "/"; }
  function norm(p) { return (p || "/").replace(/\/+$/, "") || "/"; }
  function href(c, p) { return ORIGIN + (c.prefix + (p === "/" ? "" : p) || "/"); }

  var root, panel, toggle, lastFocus, built = "", isOpen = false;

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.textContent = html; return e; }

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
      var isCur = it.p === "/" ? cur === "/" : (cur === it.p || cur.indexOf(it.p + "/") === 0);
      if (isCur) li.className = "cur";
      if (it.sub) {
        var b = el("button", "row"); b.type = "button"; b.setAttribute("aria-expanded", "false");
        b.appendChild(n); b.appendChild(lab); b.appendChild(el("span", "chev"));
        var sub = el("div", "sub"), sul = el("ul");
        it.sub.forEach(function (s) {
          var sl = el("li"), a = el("a"), bb = el("b", null, s.t), ii = el("i", null, s.d);
          a.href = href(c, s.p); a.appendChild(bb); a.appendChild(ii);
          if (norm(s.p) === cur) a.className = "cur";
          sl.appendChild(a); sul.appendChild(sl);
        });
        sub.appendChild(sul); li.appendChild(b); li.appendChild(sub);
        if (isCur) setSub(li, true);
      } else {
        var a2 = el("a", "row"); a2.href = href(c, it.p); a2.appendChild(n); a2.appendChild(lab);
        li.appendChild(a2);
      }
      ul.appendChild(li);
    });
    nav.appendChild(ul); inn.appendChild(nav);
    var lg = el("div", "lang"), sm = el("small", null, c.langLabel), box = el("div");
    var rest = stripLang(location.pathname) + location.search + location.hash;
    [["EN", "en", "/"], ["IS", "is", "/is"]].forEach(function (x) {
      var a = el("a", null, x[0]); a.lang = x[1];
      a.href = ORIGIN + (x[1] === "is" ? "/is" + (rest === "/" ? "" : rest) : rest);
      if (L === x[1]) a.setAttribute("aria-current", "true"); else a.setAttribute("aria-current", "false");
      box.appendChild(a);
    });
    lg.appendChild(sm); lg.appendChild(box); inn.appendChild(lg);
    root.appendChild(inn);
    built = location.pathname;
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
    if (b) { var li = b.parentNode; setSub(li, !li.classList.contains("open")); return; }
    var a = e.target.closest && e.target.closest("a[href]");
    if (a) {
      // same page: just close; otherwise let the browser navigate
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
    // let the panel render before fading in (stagger transition)
    root.getBoundingClientRect();
    root.classList.add("on");
    root.scrollTop = 0;
    [].forEach.call(root.querySelectorAll(".top>li.open"), function (li) { setSub(li, true); });
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
