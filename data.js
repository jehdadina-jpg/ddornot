// Dry-day data — researched 2026-11-07.
// Only dates backed by an official order, a standing statutory rule, or a mainstream news report
// of an excise order are listed. Anything we could not confirm is left OUT on purpose.
//
// tier:  "official"  – excise order / gazette (or press report quoting the order)
//        "statutory" – fixed every year by state rules
//        "reported"  – single mainstream news report of the excise guidelines; re-check closer to date
//
// Update this file whenever states publish new quarterly / festival orders.

const SRC = {
  delhiOrder: { label: "Delhi Excise order, 24 Sep 2026 (via Daily Jagran)", url: "https://www.thedailyjagran.com/india/news/diwali-2026-dry-day-liquor-shops-bars-to-remain-closed-in-delhi-up-and-other-states-check-full-list-of-upcoming-dry-days-10335408" },
  jagranDiwali: { label: "Daily Jagran, Diwali 2026 dry-day report", url: "https://www.thedailyjagran.com/india/news/diwali-2026-dry-day-liquor-shops-bars-to-remain-closed-in-delhi-up-and-other-states-check-full-list-of-upcoming-dry-days-10335408" },
  mhRules: { label: "Maharashtra statutory dry days (Kartiki Ekadashi)", url: "https://drycheck.in/guides/november-dry-days-2026" },
  keralaRule: { label: "Kerala Abkari Rule 7A — 1st of every month", url: "https://aabkaritimes.com/2025/04/106258/" },
};

window.DRY = {
  verified: "2026-11-07",
  national: [
    { date: "2027-01-26", name: "Republic Day", tier: "statutory" },
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
    "delhi": { name: "Delhi", days: [
      { date: "2026-11-08", name: "Diwali", tier: "official", src: "delhiOrder" },
      { date: "2026-11-24", name: "Guru Nanak Jayanti", tier: "official", src: "delhiOrder" },
      { date: "2026-12-25", name: "Christmas", tier: "reported", src: "jagranDiwali" },
    ]},
    "goa": { name: "Goa" },
    "gujarat": { name: "Gujarat", permanent: "Prohibition since 1960. Permit holders only." },
    "haryana": { name: "Haryana", days: [
      { date: "2026-11-08", name: "Diwali", tier: "reported", src: "jagranDiwali" },
    ]},
    "himachal-pradesh": { name: "Himachal Pradesh" },
    "jammu-kashmir": { name: "Jammu & Kashmir" },
    "jharkhand": { name: "Jharkhand" },
    "karnataka": { name: "Karnataka" },
    "kerala": { name: "Kerala", monthlyFirst: { name: "First of the month", tier: "statutory", src: "keralaRule" } },
    "ladakh": { name: "Ladakh" },
    "lakshadweep": { name: "Lakshadweep", permanent: "Prohibited, except licensed sale on Bangaram island." },
    "madhya-pradesh": { name: "Madhya Pradesh", days: [
      { date: "2026-11-08", name: "Diwali", tier: "reported", src: "jagranDiwali" },
    ]},
    "maharashtra": { name: "Maharashtra", days: [
      { date: "2026-11-08", name: "Diwali", tier: "reported", src: "jagranDiwali" },
      { date: "2026-11-20", name: "Kartiki Ekadashi", tier: "statutory", src: "mhRules" },
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
      { date: "2026-11-08", name: "Diwali", tier: "reported", src: "jagranDiwali" },
      { date: "2026-11-24", name: "Guru Nanak Jayanti", tier: "reported", src: "jagranDiwali" },
      { date: "2026-12-25", name: "Christmas", tier: "reported", src: "jagranDiwali" },
    ]},
    "uttarakhand": { name: "Uttarakhand" },
    "west-bengal": { name: "West Bengal" },
  },
  SRC,
};
