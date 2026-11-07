// Dry-day data, last researched 2026-11-07.
// Rule: a date goes in ONLY if a specific excise order (or a press report naming that
// state's order) says so. Vague "other states" claims are left out on purpose.
// Mumbai/Maharashtra Diwali, Haryana/MP Diwali and Christmas were removed after
// they turned out to be unreliable.
//
// tier:  "official"  = excise order (or press report quoting the order)
//        "statutory" = fixed every year by state rules
//        "reported"  = press report of the state's guidelines, re-check closer to date

const SRC = {
  delhiOrder: { label: "Delhi excise order of 24 Sep 2026", url: "https://www.thedailyjagran.com/india/news/diwali-2026-dry-day-liquor-shops-bars-to-remain-closed-in-delhi-up-and-other-states-check-full-list-of-upcoming-dry-days-10335408" },
  upReport: { label: "Daily Jagran report on UP excise guidelines", url: "https://www.thedailyjagran.com/india/news/diwali-2026-dry-day-liquor-shops-bars-to-remain-closed-in-delhi-up-and-other-states-check-full-list-of-upcoming-dry-days-10335408" },
  keralaRule: { label: "Kerala Abkari rules, 1st of every month", url: "https://aabkaritimes.com/2025/04/106258/" },
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
    ]},
    "goa": { name: "Goa" },
    "gujarat": { name: "Gujarat", permanent: "Prohibition since 1960. Permit holders only." },
    "haryana": { name: "Haryana" },
    "himachal-pradesh": { name: "Himachal Pradesh" },
    "jammu-kashmir": { name: "Jammu & Kashmir" },
    "jharkhand": { name: "Jharkhand" },
    "karnataka": { name: "Karnataka" },
    "kerala": { name: "Kerala", monthlyFirst: { name: "First of the month", tier: "statutory", src: "keralaRule" } },
    "ladakh": { name: "Ladakh" },
    "lakshadweep": { name: "Lakshadweep", permanent: "Prohibited, except licensed sale on Bangaram island." },
    "madhya-pradesh": { name: "Madhya Pradesh" },
    "maharashtra": { name: "Maharashtra" },
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
      { date: "2026-11-08", name: "Diwali", tier: "reported", src: "upReport" },
      { date: "2026-11-24", name: "Guru Nanak Jayanti", tier: "reported", src: "upReport" },
    ]},
    "uttarakhand": { name: "Uttarakhand" },
    "west-bengal": { name: "West Bengal" },
  },
  SRC,
};
