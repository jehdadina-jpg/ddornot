(() => {
  const $ = (id) => document.getElementById(id);
  const KEY = "dry.state";
  const { states, SRC } = DRY;
  let current = null;

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const parse = (s) => new Date(s + "T00:00");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (d, o) => d.toLocaleDateString("en-IN", o);

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

  function daysFor(slug, from, to) {
    const st = states[slug];
    const out = [...DRY.national, ...(st.days || [])];
    if (st.monthlyFirst) {
      const d = parse(from); d.setDate(1);
      while (iso(d) <= to) { out.push({ ...st.monthlyFirst, date: iso(d) }); d.setMonth(d.getMonth() + 1); }
    }
    return out.filter((d) => d.date >= from && d.date <= to).sort((a, b) => a.date.localeCompare(b.date));
  }

  const TIER = { official: "State excise order", statutory: "Fixed by state rules", reported: "Press report, re-check" };

  let timer;
  function render(slug) {
    current = slug;
    const st = states[slug];
    const now = new Date();
    const today = iso(now), tom = iso(addDays(now, 1));
    const all = st.permanent ? [] : daysFor(slug, today, iso(addDays(now, 120)));
    const on = (k) => all.filter((x) => x.date === k);
    const t = on(today), tm = on(tom);
    const isDry = !!st.permanent || t.length > 0;

    document.body.classList.toggle("is-dry", isDry);
    $("whereName").textContent = st.name;
    $("date").textContent = `${fmt(now, { weekday: "long", day: "numeric", month: "long" })}. Is it a dry day in`;
    $("state").textContent = st.name;

    const a = $("answer");
    a.textContent = isDry ? "Yes." : "No.";
    a.classList.remove("go"); void a.offsetWidth; a.classList.add("go");

    $("reason").innerHTML = st.permanent ? `<b>Every day.</b> ${esc(st.permanent)}`
      : t.length ? `It's <b>${esc(t[0].name)}</b>. Liquor shops are shut today.`
      : tm.length ? `Shops are open today. <b>Tomorrow is ${esc(tm[0].name)}</b>, so they'll be shut.`
      : `Shops are open as usual.`;

    // Next dry day + live countdown
    clearInterval(timer);
    const nx = $("next");
    const next = all.find((d) => d.date > today);
    nx.classList.remove("soon");
    if (st.permanent) {
      nx.innerHTML = `<div class="next-top"><span>Status</span></div><p class="next-name">Always dry</p><p class="next-empty">${esc(st.name)} has full prohibition, so there's nothing to count down to.</p>`;
    } else if (!next) {
      nx.innerHTML = `<div class="next-top"><span>Next dry day</span></div><p class="next-name">None announced</p><p class="next-empty">No state order covers the next four months yet. We add dates as soon as orders are published.</p>`;
    } else {
      const target = parse(next.date);
      const days = Math.round((target - parse(today)) / 864e5);
      if (days <= 7) nx.classList.add("soon");
      nx.innerHTML = `<div class="next-top"><span>${t.length ? "After today, next" : "Next dry day"}</span><span>${fmt(target, { weekday: "short", day: "numeric", month: "short" })}</span></div>
        <p class="next-name">${esc(next.name)}</p>
        <div class="clock" aria-label="Time until ${esc(next.name)}"><div><b id="cd">0</b><small>days</small></div><div><b id="ch">00</b><small>hrs</small></div><div><b id="cm">00</b><small>min</small></div><div><b id="cs">00</b><small>sec</small></div></div>`;
      const p = (n) => String(n).padStart(2, "0");
      const tick = () => {
        const ms = Math.max(0, target - new Date());
        $("cd").textContent = Math.floor(ms / 864e5);
        $("ch").textContent = p(Math.floor(ms / 36e5) % 24);
        $("cm").textContent = p(Math.floor(ms / 6e4) % 60);
        $("cs").textContent = p(Math.floor(ms / 1e3) % 60);
      };
      tick(); timer = setInterval(tick, 1000);
    }

    // Three-week calendar, starting on this week's Monday
    const start = addDays(now, -((now.getDay() + 6) % 7));
    const end = addDays(start, 20);
    const cells = [];
    for (let i = 0; i < 21; i++) {
      const d = addDays(start, i), k = iso(d);
      const names = on(k).map((x) => x.name).join(", ");
      const dry = (!!st.permanent && k >= today) || names;
      const cls = ["d", k < today && "past", k === today && "today", dry && k >= today && "dry"].filter(Boolean).join(" ");
      cells.push(`<div class="${cls}" style="--i:${i}" ${names ? `title="${esc(names)}"` : ""} aria-label="${fmt(d, { day: "numeric", month: "long" })}${dry && k >= today ? ", dry day" : ""}">${d.getDate()}</div>`);
    }
    $("days").innerHTML = cells.join("");
    $("range").textContent = `${fmt(start, { day: "numeric", month: "short" })} to ${fmt(end, { day: "numeric", month: "short" })}`;

    // Upcoming list
    const upcoming = all.slice(0, 6);
    $("ahead").innerHTML = st.permanent
      ? `<p class="empty">Shops stay shut all year under state law.</p>`
      : upcoming.length ? upcoming.map((d) => {
          const dt = parse(d.date), n = Math.round((dt - parse(today)) / 864e5);
          const src = d.src && SRC[d.src];
          const meta = src ? `<a href="${src.url}" target="_blank" rel="noopener">${esc(src.label)} <i class="ph ph-arrow-up-right"></i></a>` : `<span>${TIER[d.tier]}</span>`;
          return `<div class="row"><span class="day"><b>${dt.getDate()}</b><small>${fmt(dt, { month: "short" })}</small></span>
            <span class="what"><strong>${esc(d.name)}</strong>${meta}</span>
            <span class="in${n <= 1 ? " hot" : ""}">${n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n}d`}</span></div>`;
        }).join("")
      : `<p class="empty">Nothing announced yet for ${esc(st.name)}.</p>`;

    $("verified").textContent = fmt(parse(DRY.verified), { day: "numeric", month: "long", year: "numeric" });
    document.title = `${isDry ? "Yes" : "No"}, ${st.name} ${isDry ? "is" : "is not"} dry today`;
    try { localStorage.setItem(KEY, slug); } catch {}
    history.replaceState(null, "", `?s=${slug}`);
  }

  async function locate() {
    const pos = await new Promise((res, rej) =>
      navigator.geolocation ? navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000, maximumAge: 30 * 60e3 }) : rej(new Error("Location isn't available on this device.")));
    const { latitude, longitude } = pos.coords;
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    const j = await r.json();
    if (j.countryCode !== "IN") throw new Error("Looks like you're outside India. Pick a state below.");
    const slug = matchState(j.principalSubdivision);
    if (!slug) throw new Error(`We couldn't match "${j.principalSubdivision}". Pick it below.`);
    return slug;
  }
  const locErr = (e) => e && e.code === 1 ? "Location is blocked. Allow it in your browser settings, or pick below." : (e && e.message) || "Couldn't get your location. Pick below.";

  // State sheet
  const sheet = $("sheet");
  const drawOpts = (q = "") => {
    $("opts").innerHTML = Object.entries(states)
      .filter(([, s]) => s.name.toLowerCase().includes(q.toLowerCase()))
      .map(([k, s]) => `<button class="opt${k === current ? " cur" : ""}" data-s="${k}">${esc(s.name)}${s.permanent ? "<small>Always dry</small>" : ""}</button>`).join("")
      || `<p class="empty">No state matches "${esc(q)}".</p>`;
  };
  const openSheet = (msg = "") => { drawOpts(); $("search").value = ""; $("msg").textContent = msg; sheet.classList.add("open"); };
  const closeSheet = () => sheet.classList.remove("open");
  $("where").onclick = () => openSheet();
  $("close").onclick = closeSheet;
  addEventListener("keydown", (e) => e.key === "Escape" && closeSheet());
  sheet.onclick = (e) => {
    if (e.target === sheet) return closeSheet();
    const b = e.target.closest("[data-s]");
    if (b) { closeSheet(); render(b.dataset.s); }
  };
  $("search").oninput = (e) => drawOpts(e.target.value);
  $("useLoc").onclick = async () => {
    $("msg").textContent = "Finding you...";
    try { const s = await locate(); closeSheet(); render(s); }
    catch (e) { $("msg").textContent = locErr(e); }
  };

  async function boot() {
    const params = new URLSearchParams(location.search);
    const param = params.get("s");
    let saved = null; try { saved = localStorage.getItem(KEY); } catch {}
    if (param && states[param] && !params.has("locate")) return render(param);
    if (saved && states[saved]) render(saved);
    try { render(await locate()); }
    catch (e) {
      if (!saved) { $("whereName").textContent = "Pick state"; openSheet(locErr(e)); }
    }
  }

  boot();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
