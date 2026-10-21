/* AI Gurukool site extras: WhatsApp channel pop-up + newsletter banner.
   Loaded on every page with: <script src="/assets/aig.js" defer></script> */
(function () {
  /* ===== EDIT HERE ===== */
  var CHANNEL = "https://whatsapp.com/channel/0029Va7C8ZA3mFY86O4FQ81w";
  var BREVO_ACTION = "https://57d32bab.sibforms.com/serve/MUIFAPB4NYA8XwQgjVUHoj9h7ClIFgtR3uVX2W61Ck6xEUtYxjL-p05hibd17wl5ENSqrSTepO-jJ1E9ph0hK813CnriJExAJkWWsRQOwD4Cw51fqMqonJ39ZAYsZa1RuqR5Cxi7QxjiKi-siVi6LJ_w45efNrKxPArIP7e61a48E2fLw44idwQ13Ad_2e0nlXAuCJzrlOvsFKAZuw==";
  var POPUP_DELAY_MS = 1500;
  /* ===================== */

  var css = [
    ".aig-ov{position:fixed;inset:0;z-index:100;background:rgba(11,22,38,.55);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .25s}",
    ".aig-ov.on{opacity:1}",
    ".aig-pop{position:relative;background:#fff;color:#1a2332;max-width:380px;width:100%;border-radius:10px;padding:30px 26px 24px;box-shadow:0 30px 60px -20px rgba(11,22,38,.5);font-family:Inter,system-ui,sans-serif;text-align:center}",
    ".aig-pop .x{position:absolute;top:8px;right:10px;background:none;border:0;font-size:24px;line-height:1;color:#8a94a3;cursor:pointer;padding:6px}",
    ".aig-pop .ic{width:54px;height:54px;border-radius:50%;background:#25d366;display:grid;place-items:center;margin:0 auto 14px}",
    ".aig-pop .ic svg{width:28px;height:28px;fill:#fff}",
    ".aig-pop .lb{color:#9a7a3a;font-size:.72rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;margin-bottom:6px}",
    ".aig-pop h3{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:1.45rem;line-height:1.2;margin:0 0 8px}",
    ".aig-pop p{color:#5d6878;font-size:.95rem;line-height:1.55;margin:0 0 18px}",
    ".aig-pop .go{display:flex;align-items:center;justify-content:center;gap:8px;background:#25d366;color:#fff;font-weight:600;padding:13px 18px;border-radius:8px;text-decoration:none;margin-bottom:12px}",
    ".aig-pop .go:hover{background:#1fbd5a}",
    ".aig-pop .go svg{width:18px;height:18px;fill:currentColor}",
    ".aig-pop .vote{display:flex;gap:10px}",
    ".aig-pop .vote button{flex:1;padding:10px 8px;border-radius:8px;font:500 .86rem Inter,system-ui,sans-serif;cursor:pointer;border:1px solid #e4e0d6;background:#f6f4ef;color:#1a2332}",
    ".aig-pop .vote button:hover{border-color:#c9a45c}",
    ".aig-nl{background:linear-gradient(135deg,#0f1d31,#1d3350);color:#fff;padding:56px 0;font-family:Inter,system-ui,sans-serif}",
    ".aig-nl .in{max-width:1180px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}",
    ".aig-nl .tx{max-width:520px}",
    ".aig-nl .lb{color:#c9a45c;font-size:.78rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px}",
    ".aig-nl h3{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(1.5rem,3vw,2rem);line-height:1.15;margin:0 0 8px}",
    ".aig-nl p{color:#cfd7e3;margin:0}",
    ".aig-nl form{display:flex;gap:10px;flex:1;min-width:260px;max-width:460px}",
    ".aig-nl input[type=email]{flex:1;min-width:0;padding:14px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;font:inherit;font-size:.95rem}",
    ".aig-nl input[type=email]::placeholder{color:#a9b4c4}",
    ".aig-nl input[type=email]:focus{outline:none;border-color:#c9a45c}",
    ".aig-nl button{padding:14px 22px;border-radius:8px;border:0;background:#c9a45c;color:#0f1d31;font:600 .95rem Inter,system-ui,sans-serif;cursor:pointer;white-space:nowrap}",
    ".aig-nl button:hover{background:#e0c285}",
    ".aig-nl .input--hidden{display:none}",
    ".aig-nl .sib-form-message-panel{display:none;margin-top:12px;font-size:.92rem;padding:10px 14px;border-radius:8px}",
    "#success-message.sib-form-message-panel{background:rgba(37,211,102,.15);color:#b8f5cf}",
    "#error-message.sib-form-message-panel{background:rgba(255,73,73,.15);color:#ffc4c4}",
    ".aig-nl .sib-form-message-panel--active{display:block}",
    ".aig-nl .sib-input,.aig-nl .form__entry{flex:1;min-width:0;display:flex;flex-direction:column}",
    ".aig-nl .entry__error{color:#ffc4c4;font-size:.85rem;margin-top:6px}",
    ".aig-nl .entry__error:empty{display:none}",
    ".aig-nl .box{flex:1;min-width:260px;max-width:460px}",
    ".aig-nl .box form{max-width:none}",
    "@media(max-width:560px){.aig-nl form{flex-direction:column}.aig-nl{padding:44px 0}}"
  ].join("");

  var waIcon = '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.5.3-.7.3-1.3.2-1.5l-.8-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-3.6.9 1-3.5A9.8 9.8 0 1 1 12 21.8zM12 0a12 12 0 0 0-10.3 18L0 24l6.2-1.6A12 12 0 1 0 12 0z"/></svg>';

  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- Newsletter banner (just above the footer) ---------- */
  var nl = document.createElement("section");
  nl.className = "aig-nl";
  nl.innerHTML =
    '<div class="in">' +
      '<div class="tx">' +
        '<div class="lb">Free Newsletter</div>' +
        '<h3>AI race mein peeche mat rehna</h3>' +
        '<p>Roz ki AI updates aur automation tips, seedha aapke inbox mein. Bilkul free.</p>' +
      '</div>' +
      '<div class="box sib-form" id="sib-form-container">' +
        '<div id="sib-container">' +
          '<form id="sib-form" method="POST" data-type="subscription">' +
            '<div class="sib-input"><div class="form__entry">' +
              '<input class="input" type="email" id="EMAIL" name="EMAIL" placeholder="Aapka email" autocomplete="email" required data-required="true">' +
              '<label class="entry__error entry__error--primary"></label>' +
            '</div></div>' +
            '<input type="text" name="email_address_check" value="" class="input--hidden" tabindex="-1" autocomplete="off">' +
            '<input type="hidden" name="locale" value="en">' +
            '<button class="sib-form-block__button sib-form-block__button-with-loader" form="sib-form" type="submit">Subscribe</button>' +
          '</form>' +
        '</div>' +
        '<div id="success-message" class="sib-form-message-panel"><div class="sib-form-message-panel__text"><span class="sib-form-message-panel__inner-text">Ho gaya! Welcome to AI Gurukool newsletter.</span></div></div>' +
        '<div id="error-message" class="sib-form-message-panel"><div class="sib-form-message-panel__text"><span class="sib-form-message-panel__inner-text">Subscribe nahi ho paya. Email check karke dobara try karein.</span></div></div>' +
      '</div>' +
    '</div>';
  nl.querySelector("form").setAttribute("action", BREVO_ACTION);
  var footer = document.querySelector("footer");
  if (footer) footer.parentNode.insertBefore(nl, footer); else document.body.appendChild(nl);

  /* Brevo's own script handles the submit and success/error messages. */
  window.LOCALE = "en";
  window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = window.GENERIC_INVALID_MESSAGE = "Sahi email daaliye.";
  window.REQUIRED_ERROR_MESSAGE = "Email zaroori hai.";
  window.AUTOHIDE = false;
  var bs = document.createElement("script");
  bs.src = "https://sibforms.com/forms/end-form/build/main.js";
  bs.defer = true;
  document.body.appendChild(bs);

  /* ---------- WhatsApp channel pop-up (once per visitor) ---------- */
  var KEY = "aig_wa_popup";
  function seen() { try { return localStorage.getItem(KEY); } catch (e) { return "1"; } }
  function remember(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  if (seen()) return;

  setTimeout(function () {
    var ov = document.createElement("div");
    ov.className = "aig-ov";
    ov.innerHTML =
      '<div class="aig-pop" role="dialog" aria-modal="true" aria-labelledby="aig-pop-t">' +
        '<button class="x" aria-label="Close">&times;</button>' +
        '<div class="ic">' + waIcon + '</div>' +
        '<div class="lb">Free WhatsApp Channel</div>' +
        '<h3 id="aig-pop-t">AI Automation ki ABC</h3>' +
        '<p>Would you like to join? It\'s free and in Hinglish.</p>' +
        '<a class="go" target="_blank" rel="noopener">' + waIcon + 'Join the Channel</a>' +
        '<div class="vote"><button data-v="joined">I joined</button><button data-v="no">I don\'t want to join</button></div>' +
      '</div>';
    ov.querySelector(".go").href = CHANNEL;
    function close(v) {
      remember(v);
      ov.classList.remove("on");
      setTimeout(function () { ov.remove(); }, 250);
    }
    ov.addEventListener("click", function (e) {
      if (e.target === ov || e.target.classList.contains("x")) close("closed");
      var v = e.target.getAttribute && e.target.getAttribute("data-v");
      if (v) close(v);
    });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close("closed"); document.removeEventListener("keydown", esc); }
    });
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add("on"); });
  }, POPUP_DELAY_MS);
})();
