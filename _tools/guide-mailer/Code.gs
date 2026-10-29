/**
 * AI Gurukool: Guide Mailer
 * Lives inside the Free Guides Google Sheet (Extensions > Apps Script).
 *
 * Sheet columns (tab 1): A Title | B Description | C PDF link | D Email ("Yes" = send by email)
 * When someone asks for a "Yes" guide on aigurukool.in/resources, this script:
 *   1. finds the guide's PDF link in the Sheet
 *   2. adds the person to the Brevo newsletter list
 *   3. emails them the PDF link through Brevo
 *   4. logs the request in a "Requests" tab
 *
 * Setup values go in Project Settings > Script properties (never in this file):
 *   BREVO_API_KEY   your Brevo API key
 *   BREVO_LIST_ID   newsletter list number in Brevo, e.g. 3
 *   SENDER_EMAIL    a sender already verified in Brevo
 *   SENDER_NAME     e.g. AI Gurukool
 */

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    var email = String(p.email || "").trim().toLowerCase();
    var title = String(p.title || "").trim();
    if (p.website) return out_(true, "ok"); // honeypot: bots fill this, people don't
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out_(false, "bad_email");

    // One request per email per guide every 2 minutes
    var cache = CacheService.getScriptCache();
    var key = "r_" + Utilities.base64EncodeWebSafe(email + "|" + title).slice(0, 200);
    if (cache.get(key)) return out_(true, "already_sent");

    var guide = findGuide_(title);
    if (!guide) return out_(false, "not_found");

    var props = PropertiesService.getScriptProperties();
    addContact_(props, email);
    sendGuide_(props, email, guide);
    cache.put(key, "1", 120);
    log_(email, guide.title);
    return out_(true, "sent");
  } catch (err) {
    console.error(err);
    return out_(false, "error");
  }
}

function findGuide_(title) {
  var rows = SpreadsheetApp.getActive().getSheets()[0].getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var t = String(rows[i][0]).trim(), url = String(rows[i][2]).trim();
    var gated = String(rows[i][3]).trim().toLowerCase() === "yes";
    if (gated && t === title && /^(https:\/\/|\/)/.test(url)) {
      if (url.charAt(0) === "/") url = "https://www.aigurukool.in" + url;
      return { title: t, url: url };
    }
  }
  return null;
}

function brevo_(props, path, body) {
  var res = UrlFetchApp.fetch("https://api.brevo.com/v3" + path, {
    method: "post", contentType: "application/json", muteHttpExceptions: true,
    headers: { "api-key": props.getProperty("BREVO_API_KEY"), accept: "application/json" },
    payload: JSON.stringify(body)
  });
  var code = res.getResponseCode();
  if (code >= 300) throw new Error("Brevo " + path + " " + code + ": " + res.getContentText());
}

function addContact_(props, email) {
  brevo_(props, "/contacts", {
    email: email, updateEnabled: true,
    listIds: [Number(props.getProperty("BREVO_LIST_ID"))]
  });
}

function sendGuide_(props, email, g) {
  var safeTitle = g.title.replace(/[<>&"]/g, "");
  var html =
    '<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1e2433;line-height:1.6">' +
    '<h2 style="color:#0f1d31">Aapki free guide aa gayi!</h2>' +
    '<p>Namaste! Aapne <b>' + safeTitle + '</b> maangi thi. Neeche button dabaiye aur download kar lijiye.</p>' +
    '<p style="margin:28px 0"><a href="' + encodeURI(g.url) + '" style="background:#c9a45c;color:#0f1d31;' +
    'padding:14px 26px;border-radius:6px;text-decoration:none;font-weight:bold">PDF Download karein</a></p>' +
    '<p>Aur saari free guides yahan milengi: <a href="https://www.aigurukool.in/resources/">aigurukool.in/resources</a></p>' +
    '<p>Ab aap AI Gurukool newsletter mein bhi jud gaye hain, AI ki zaroori updates Hinglish mein milti rahengi.</p>' +
    '<p style="background:#fff7e6;border-left:4px solid #c9a45c;padding:12px 14px;border-radius:4px">' +
    '<b>Ek chhota sa kaam:</b> Agar ye mail Gmail ke Promotions tab mein aaya hai, to isse <b>Primary</b> tab mein drag kar dijiye. ' +
    'Gmail poochhe to "Yes" dabaiye. Isse agli guides aur newsletter seedha aapke inbox mein aayenge.</p>' +
    '<p>Swapnil<br>AI Gurukool | AI Seekhega India</p></div>';
  brevo_(props, "/smtp/email", {
    sender: { email: props.getProperty("SENDER_EMAIL"), name: props.getProperty("SENDER_NAME") || "AI Gurukool" },
    to: [{ email: email }],
    subject: "Aapki free guide: " + safeTitle,
    htmlContent: html
  });
}

function log_(email, title) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName("Requests") || ss.insertSheet("Requests");
  if (sh.getLastRow() === 0) sh.appendRow(["Time", "Email", "Guide"]);
  sh.appendRow([new Date(), email, title]);
}

function out_(ok, status) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok, status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor to test the Brevo setup (sends to SENDER_EMAIL). */
function testSetup() {
  var props = PropertiesService.getScriptProperties();
  sendGuide_(props, props.getProperty("SENDER_EMAIL"),
    { title: "Test Guide", url: "https://www.aigurukool.in/resources/" });
  Logger.log("Test email sent. Check your inbox.");
}
