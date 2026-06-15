const excluded = ["dashboard", "admin", "api", "auth", "login", "onboarding", "reset-password", "forgot-password", "/r/", "review"];

const extraUrls = [
  "https://www.barberiaos.com/instagram",
  "https://www.barberiaos.com/barberias-fundadoras",
  "https://www.barberiaos.com/calculadora-booksy",
  "https://www.barberiaos.com/pedir-demo",
  "https://www.barberiaos.com/alternativa-a-booksy",
  "https://www.barberiaos.com/blog/cuanto-cobra-booksy"
];

let xml = "";
let debugSource = "empty";

try {
  const allItems = $input.all();
  const raw = allItems[0]?.json;

  if (raw !== null && raw !== undefined) {
    const candidates = [raw.data, raw.body, raw.content, raw.text, raw.response];
    for (const c of candidates) {
      if (c && typeof c === "string" && c.includes("<loc>")) {
        xml = c;
        debugSource = "string-property";
        break;
      }
      if (c && typeof c === "object") {
        const s = JSON.stringify(c);
        if (s.includes("<loc>")) { xml = s; debugSource = "json-object"; break; }
      }
    }
    if (!xml) {
      const full = JSON.stringify(raw);
      if (full.includes("<loc>")) { xml = full; debugSource = "full-json"; }
    }
  }
} catch (e) {
  debugSource = "catch:" + String(e).slice(0, 60);
}

let sitemapUrls = [];
try {
  const matches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
  sitemapUrls = matches
    .map(m => m.replace(/<\/?loc>/g, "").trim())
    .filter(u => u.startsWith("http") && !excluded.some(ex => u.includes(ex)));
} catch(e) { sitemapUrls = []; }

const allUrls = [...new Set([...sitemapUrls, ...extraUrls])];

return [{ json: { urls: allUrls, total: allUrls.length, xmlLength: xml.length, debugSource: debugSource } }];
