(() => {
  const $ = (id) => document.getElementById(id);
  const KEY = "dry.state";
  const { states, SRC } = DRY;

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const parse = (s) => new Date(s + "T00:00");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const slugify = (s) => s.toLowerCase().replace(/&/g, " ").replace(/\band\b/g, " ").replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  const ALIAS = {
    "national-capital-territory-of-delhi": "delhi", "nct-of-delhi": "delhi", "new-delhi": "delhi",
    "orissa": "odisha", "pondicherry": "puducherry", "andaman-nicobar": "andaman-nicobar-islands",
    "dadra-nagar-haveli": "dadra-nagar-haveli-daman-diu", "daman-diu": "dadra-nagar-haveli-daman-diu",
  };
  const matchState = (name) => {
    const s = slugify(name || "");
    if (states[s]) return s;
    if (ALIAS[s]) return ALIAS[s];
    return Object.keys(states).find((k) => s.includes(k) || k.includes(s)) || null;
  };

  // All dry days for a state within [from, to] (ISO strings)
  function daysFor(slug, from, to) {
    const st = states[slug];
    const out = [...DRY.national, ...(st.days || [])];
    if (st.monthlyFirst) {
      let d = parse(from); d.setDate(1);
      while (iso(d) <= to) { out.push({ ...st.monthlyFirst, date: iso(d) }); d.setMonth(d.getMonth() + 1); }
    }
    return out.filter((d) => d.date >= from && d.date <= to).sort((a, b) => a.date.localeCompare(b.date));
  }

  let timer;
  function render(slug) {
    const st = states[slug];
    const now = new Date();
    const today = iso(now), tom = iso(addDays(now, 1));
    const horizon = iso(addDays(now, 90));
    const all = st.permanent ? [] : daysFor(slug, today, horizon);
    const on = (d) => all.filter((x) => x.date === d);
    const t = on(today), tm = on(tom);
    const isDry = !!st.permanent || t.length > 0;

    document.body.classList.remove("loading");
    document.body.classList.toggle("is-dry", isDry);
    $("whereName").textContent = st.name;
    $("date").textContent = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
    $("q").innerHTML = `Is today a dry day in <b>${esc(st.name)}</b>?`;

    const word = isDry ? "Yes." : "Nope.";
    const a = $("answer");
    a.textContent = word; a.classList.remove("go"); void a.offsetWidth; a.classList.add("go");

    $("reason").innerHTML = st.permanent ? `<b>Every single day.</b> ${esc(st.permanent)}`
      : t.length ? `It's <b>${esc(t[0].name)}</b>. Liquor shops are shut today.`
      : tm.length ? `You're fine today, but <b>tomorrow is ${esc(tm[0].name)}</b>. Stock up tonight.`
      : `Shops are open. Pour one out responsibly.`;

    // Countdown to next dry day
    clearInterval(timer);
    const next = all.find((d) => d.date > today);
    const cd = $("countdown");
    if (st.permanent) cd.innerHTML = "";
    else if (!next) cd.innerHTML = `No confirmed dry days in the next 90 days`;
    else {
      const target = parse(next.date);
      const tick = () => {
        const ms = Math.max(0, target - new Date());
        const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
        const p = (n) => String(n).padStart(2, "0");
        cd.innerHTML = `<span>${t.length ? "Next one" : "Dry in"}</span><span class="t">${d}<small>d</small>${p(h)}<small>h</small>${p(m)}<small>m</small>${p(s)}<small>s</small></span><span>· ${esc(next.name)}</span>`;
      };
      tick(); timer = setInterval(tick, 1000);
    }

    // 21-day strip
    const strip = [];
    for (let i = 0; i < 21; i++) {
      const d = addDays(now, i), k = iso(d);
      const dry = !!st.permanent || on(k).length > 0;
      strip.push(`<div class="day${i === 0 ? " today" : ""}${dry ? " dry" : ""}" style="--i:${i}" title="${esc(on(k).map((x) => x.name).join(", "))}">
        <span class="w">${d.toLocaleDateString("en-IN", { weekday: "short" })}</span><span class="n">${d.getDate()}</span></div>`);
    }
    $("strip").innerHTML = strip.join("");
    $("range").textContent = `${now.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${addDays(now, 20).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;

    // Upcoming list
    const upcoming = all.filter((d) => d.date >= today).slice(0, 8);
    $("ahead").innerHTML = st.permanent
      ? `<li class="empty" style="display:block">Permanent prohibition. There's no calendar to check.</li>`
      : upcoming.length ? upcoming.map((d, i) => {
          const dt = parse(d.date), days = Math.round((dt - parse(today)) / 864e5);
          const src = d.src && SRC[d.src];
          return `<li style="--i:${i}">
            <span class="dt"><b>${dt.getDate()}</b>${dt.toLocaleDateString("en-IN", { month: "short" })}</span>
            <span class="nm">${esc(d.name)}<span class="tag ${d.tier}">${d.tier}</span>${src ? `<a href="${src.url}" target="_blank" rel="noopener">${esc(src.label)} ↗</a>` : ""}</span>
            <span class="in">${days === 0 ? "today" : days === 1 ? "tmrw" : days + "d"}</span></li>`;
        }).join("")
      : `<li class="empty" style="display:block">No state dry days have been announced for the next 90 days. Election and district orders can still close shops.</li>`;

    $("verified").textContent = parse(DRY.verified).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    document.title = `${isDry ? "Yes" : "No"} — dry day in ${st.name}?`;
    try { localStorage.setItem(KEY, slug); } catch {}
    history.replaceState(null, "", `?s=${slug}`);
  }

  async function locate() {
    $("whereName").textContent = "Locating";
    const pos = await new Promise((res, rej) =>
      navigator.geolocation ? navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000, maximumAge: 30 * 60e3 }) : rej(new Error("no geolocation")));
    const { latitude, longitude } = pos.coords;
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    const j = await r.json();
    if (j.countryCode !== "IN") throw new Error("outside India");
    const slug = matchState(j.principalSubdivision);
    if (!slug) throw new Error("unknown state " + j.principalSubdivision);
    return slug;
  }

  // State picker
  const sheet = $("sheet");
  const drawOpts = (q = "") => {
    $("opts").innerHTML = Object.entries(states)
      .filter(([, s]) => s.name.toLowerCase().includes(q.toLowerCase()))
      .map(([k, s]) => `<button class="opt" data-s="${k}">${esc(s.name)}${s.permanent ? "<small>always dry</small>" : ""}</button>`).join("");
  };
  const openSheet = () => { drawOpts(); $("search").value = ""; sheet.classList.add("open"); };
  $("where").onclick = openSheet;
  sheet.onclick = (e) => {
    if (e.target === sheet) return sheet.classList.remove("open");
    const b = e.target.closest("[data-s]");
    if (b) { sheet.classList.remove("open"); render(b.dataset.s); }
  };
  $("search").oninput = (e) => drawOpts(e.target.value);
  $("useLoc").onclick = () => { sheet.classList.remove("open"); boot(true); };

  async function boot(forceLocate) {
    const params = new URLSearchParams(location.search);
    const param = params.get("s");
    let saved = null; try { saved = localStorage.getItem(KEY); } catch {}
    // A shared ?s= link wins unless launched from the home screen (?locate)
    if (!forceLocate && param && states[param] && !params.has("locate")) return render(param);
    if (saved && states[saved]) render(saved); // instant paint, then refine with GPS
    try { render(await locate()); }
    catch (e) {
      console.warn("locate failed:", e?.message || e);
      if (!saved) { $("whereName").textContent = "Pick state"; openSheet(); }
    }
  }

  boot();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
