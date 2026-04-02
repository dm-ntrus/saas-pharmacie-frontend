import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(frLocale);

export interface CountryOption {
  code: string;
  name: string;
}

const PRIORITY_CODES = [
  "CD", "CG", "FR", "BE", "CH", "CA", "CI", "CM", "SN", "TG",
  "BF", "BJ", "GA", "ML", "MG", "NE", "TD", "GN", "RW", "BI",
  "MA", "DZ", "TN",
];

let _cache: CountryOption[] | null = null;

export function getAllCountries(): CountryOption[] {
  if (_cache) return _cache;

  const names = countries.getNames("fr", { select: "official" });
  const all: CountryOption[] = Object.entries(names)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const prioritySet = new Set(PRIORITY_CODES);
  const priority = PRIORITY_CODES.map((c) => all.find((x) => x.code === c)).filter(Boolean) as CountryOption[];
  const rest = all.filter((c) => !prioritySet.has(c.code));

  _cache = [...priority, ...rest];
  return _cache;
}

export function getCountryName(code: string): string {
  return countries.getName(code, "fr") ?? code;
}

export function getTimezonesByCountry(code: string): string[] {
  const map: Record<string, string[]> = {
    CD: ["Africa/Kinshasa", "Africa/Lubumbashi"],
    CG: ["Africa/Brazzaville"],
    FR: ["Europe/Paris"],
    BE: ["Europe/Brussels"],
    CH: ["Europe/Zurich"],
    CA: ["America/Montreal", "America/Toronto", "America/Vancouver"],
    US: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"],
    CI: ["Africa/Abidjan"],
    CM: ["Africa/Douala"],
    SN: ["Africa/Dakar"],
    MA: ["Africa/Casablanca"],
    DZ: ["Africa/Algiers"],
    TN: ["Africa/Tunis"],
    RW: ["Africa/Kigali"],
    BI: ["Africa/Bujumbura"],
    MG: ["Indian/Antananarivo"],
    GA: ["Africa/Libreville"],
    TG: ["Africa/Lome"],
    BF: ["Africa/Ouagadougou"],
    BJ: ["Africa/Porto-Novo"],
    ML: ["Africa/Bamako"],
    NE: ["Africa/Niamey"],
    TD: ["Africa/Ndjamena"],
    GN: ["Africa/Conakry"],
    GB: ["Europe/London"],
    DE: ["Europe/Berlin"],
    ES: ["Europe/Madrid"],
    IT: ["Europe/Rome"],
    PT: ["Europe/Lisbon"],
    NL: ["Europe/Amsterdam"],
    LU: ["Europe/Luxembourg"],
  };
  return map[code] ?? ["UTC"];
}

export function getCurrencyByCountry(code: string): string {
  const map: Record<string, string> = {
    CD: "CDF", CG: "XAF", FR: "EUR", BE: "EUR", CH: "CHF",
    CA: "CAD", US: "USD", CI: "XOF", CM: "XAF", SN: "XOF",
    MA: "MAD", DZ: "DZD", TN: "TND", RW: "RWF", BI: "BIF",
    MG: "MGA", GA: "XAF", TG: "XOF", BF: "XOF", BJ: "XOF",
    ML: "XOF", NE: "XOF", TD: "XAF", GN: "GNF", GB: "GBP",
    DE: "EUR", ES: "EUR", IT: "EUR", PT: "EUR", NL: "EUR",
    LU: "EUR",
  };
  return map[code] ?? "USD";
}
