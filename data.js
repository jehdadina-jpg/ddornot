// Dry-day data, last researched 2026-11-07.
//
// Rule: a date goes in ONLY if it is backed by an official order, a standing state rule
// confirmed by the excise department, or a named news report of a specific order.
//
// tier:   "official"  = the excise order itself (we read the PDF)
//         "statutory" = fixed every year by state law, confirmed by the excise dept
//         "reported"  = news report of a specific order; re-check closer to the date
//         "expected"  = declared every recent year but this year's order isn't out yet (app shows "Maybe")
// scope:  "shops" = only liquor shops (vends) close, bars/restaurants stay open
//         "all"   = shops, bars, restaurants and clubs all close
// area:   set when the closure only covers part of the state
// note:   extra detail shown under the name

const SRC = {
  dlJan: { label: "Delhi Excise order, 15 Jan 2026", url: "https://excise.delhi.gov.in/sites/default/files/Excise/circulars-orders/drydayorder_2026.pdf" },
  dlApr: { label: "Delhi Excise order, 24 Apr 2026", url: "https://excise.delhi.gov.in/sites/default/files/Excise/circulars-orders/dry_day_26.pdf" },
  dlMay: { label: "Delhi Excise order, 26 May 2026", url: "https://excise.delhi.gov.in/sites/default/files/Excise/circulars-orders/dry_day_28_05_26.pdf" },
  dlOct: { label: "Delhi Excise circular, 8 Oct 2026", url: "https://excise.delhi.gov.in/sites/default/files/Excise/circulars-orders/vends_closure_9th_and_10th_october.pdf" },
  dlSep: { label: "Delhi Excise order, 24 Sep 2026", url: "https://excise.delhi.gov.in/sites/default/files/Excise/circulars-orders/dry_day_notice_eng.pdf" },
  mhEight: { label: "Maharashtra Excise Commissioner, 8 statutory dry days", url: "https://www.freepressjournal.in/mumbai/maharashtra-excise-dept-dismisses-dry-day-cancelled-claims-as-fake-news-says-mandatory-dates-to-continue" },
  mhAshadhi: { label: "Punekar News, Ashadhi Ekadashi dry day", url: "https://www.punekarnews.in/?p=240679" },
  mhPolls: { label: "State Election Commission order (Patrika)", url: "https://www.patrika.com/en/mumbai-news/dry-day-liquor-shops-to-remain-closed-for-3-consecutive-days-in-29-cities-government-order-issued-20257865" },
  mhShivaji: { label: "Lokmat Times, Shivaji Jayanti dry day", url: "https://www.lokmattimes.com/maharashtra/dry-day-on-february-19-2026-in-maharashtra-check-whats-open-and-closed-on-chhatrapati-shivaji-maharaj-jayanti-a517" },
  mumDec6: { label: "Mumbai City collector, 2024 and 2025 orders", url: "https://www.thedailyjagran.com/maharashtra/mumbai-dry-days-liquor-shops-closed-on-christmas-mahaparinirvan-diwas-in-december-full-list-10282980" },
  upReport: { label: "Daily Jagran, UP excise guidelines", url: "https://www.thedailyjagran.com/india/news/diwali-2026-dry-day-liquor-shops-bars-to-remain-closed-in-delhi-up-and-other-states-check-full-list-of-upcoming-dry-days-10335408" },
  keralaRule: { label: "Kerala Abkari rules, 1st of every month", url: "https://aabkaritimes.com/2025/04/106258/" },
};

const DL = (date, name, src, scope = "shops", extra = {}) => ({ date, name, tier: "official", src, scope, ...extra });
const MH = (date, name, extra = {}) => ({ date, name, tier: "statutory", src: "mhEight", scope: "all", ...extra });

window.DRY = {
  verified: "2026-11-07",
  national: [
    { date: "2027-01-26", name: "Republic Day", tier: "statutory", scope: "all" },
  ],
  states: {
    "andaman-nicobar-islands": { name: "Andaman & Nicobar Islands" },
    "andhra-pradesh": { name: "Andhra Pradesh" },
    "arunachal-pradesh": { name: "Arunachal Pradesh" },
    "assam": { name: "Assam" },
    "bihar": { name: "Bihar", permanent: "Total prohibition since April 2016." },
    "chandigarh": { name: "Chandigarh" },
    "chhattisgarh": { name: "Chhattisgarh" },
    "dadra-nagar-haveli-daman-diu": { name: "Dadra & Nagar Haveli & Daman & Diu" },

    // Every 2026 date below is copied from the signed orders on excise.delhi.gov.in/notifications
    "delhi": { name: "Delhi", days: [
      DL("2026-01-26", "Republic Day", "dlJan", "all"),
      DL("2026-02-15", "Maha Shivratri", "dlJan"),
      DL("2026-03-21", "Id-ul-Fitr", "dlJan"),
      DL("2026-03-26", "Ram Navami", "dlJan"),
      DL("2026-03-31", "Mahavir Jayanti", "dlJan"),
      DL("2026-05-01", "Buddha Purnima", "dlApr"),
      DL("2026-05-28", "Id-ul-Zuha (Bakrid)", "dlMay", "shops", { note: "Moved from 27 May by a later order" }),
      DL("2026-06-26", "Muharram", "dlApr"),
      DL("2026-08-15", "Independence Day", "dlApr", "all"),
      DL("2026-09-04", "Janmashtami", "dlApr"),
      DL("2026-10-02", "Gandhi Jayanti", "dlSep", "all"),
      DL("2026-10-09", "Vends shut for public order", "dlOct"),
      DL("2026-10-10", "Vends shut for public order", "dlOct"),
      DL("2026-11-08", "Diwali", "dlSep"),
      DL("2026-11-24", "Guru Nanak Jayanti", "dlSep"),
    ]},
    "goa": { name: "Goa" },
    "gujarat": { name: "Gujarat", permanent: "Prohibition since 1960. Permit holders only." },
    "haryana": { name: "Haryana", days: [
      { date: "2027-01-26", name: "Republic Day", tier: "statutory", scope: "all", note: "Haryana closes until 5 pm" },
    ]},
    "himachal-pradesh": { name: "Himachal Pradesh" },
    "jammu-kashmir": { name: "Jammu & Kashmir" },
    "jharkhand": { name: "Jharkhand" },
    "karnataka": { name: "Karnataka" },
    "kerala": { name: "Kerala", monthlyFirst: { name: "First of the month", tier: "statutory", src: "keralaRule", scope: "all" } },
    "ladakh": { name: "Ladakh" },
    "lakshadweep": { name: "Lakshadweep", permanent: "Prohibited, except licensed sale on Bangaram island." },
    "madhya-pradesh": { name: "Madhya Pradesh" },

    // 8 statewide statutory days (Excise Commissioner, Feb 2026) + election and Mumbai collector orders.
    // Holi, Diwali and Christmas are NOT statewide dry days in Maharashtra.
    "maharashtra": { name: "Maharashtra", days: [
      { date: "2026-01-14", name: "Municipal elections", tier: "reported", src: "mhPolls", scope: "all", area: "29 municipal corporations incl. Mumbai" },
      { date: "2026-01-15", name: "Municipal elections (polling)", tier: "reported", src: "mhPolls", scope: "all", area: "29 municipal corporations incl. Mumbai" },
      { date: "2026-01-16", name: "Municipal elections (counting)", tier: "reported", src: "mhPolls", scope: "all", area: "29 municipal corporations incl. Mumbai" },
      MH("2026-01-26", "Republic Day"),
      MH("2026-01-30", "Martyrs' Day"),
      { date: "2026-02-19", name: "Shivaji Maharaj Jayanti", tier: "reported", src: "mhShivaji", scope: "all" },
      MH("2026-05-01", "Maharashtra Day"),
      MH("2026-07-25", "Ashadhi Ekadashi", { src: "mhAshadhi" }),
      MH("2026-08-15", "Independence Day"),
      MH("2026-09-25", "Anant Chaturdashi"),
      MH("2026-10-02", "Gandhi Jayanti"),
      MH("2026-11-20", "Kartiki Ekadashi", { note: "Kartik Shuddha Ekadashi. Pandharpur yatra is on 21 Nov" }),
      { date: "2026-12-06", name: "Mahaparinirvan Din", tier: "expected", src: "mumDec6", scope: "all", area: "Mumbai City", note: "Declared by the collector in 2024 and 2025. 2026 order not out yet" },
      MH("2027-01-26", "Republic Day"),
      MH("2027-01-30", "Martyrs' Day"),
    ]},
    "manipur": { name: "Manipur" },
    "meghalaya": { name: "Meghalaya" },
    "mizoram": { name: "Mizoram", permanent: "Prohibition under the MLPC Act, 2019." },
    "nagaland": { name: "Nagaland", permanent: "Total prohibition since 1989." },
    "odisha": { name: "Odisha" },
    "puducherry": { name: "Puducherry" },
    "punjab": { name: "Punjab" },
    "rajasthan": { name: "Rajasthan" },
    "sikkim": { name: "Sikkim" },
    "tamil-nadu": { name: "Tamil Nadu" },
    "telangana": { name: "Telangana" },
    "tripura": { name: "Tripura" },
    "uttar-pradesh": { name: "Uttar Pradesh", days: [
      { date: "2026-11-08", name: "Diwali", tier: "reported", src: "upReport", scope: "all" },
      { date: "2026-11-24", name: "Guru Nanak Jayanti", tier: "reported", src: "upReport", scope: "all" },
    ]},
    "uttarakhand": { name: "Uttarakhand" },
    "west-bengal": { name: "West Bengal" },
  },
  SRC,
};
