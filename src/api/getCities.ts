import * as cheerio from "cheerio";
import { API_URL, CITIES_CACHE_SIZE, ONE_MONTH_MS } from "../constants";
import { LRUCache } from "lru-cache/raw";

const CITIES_CACHE_KEY = "cities";

const citiesCache = new LRUCache<string, CitiesPayload>({
  max: CITIES_CACHE_SIZE,
  ttl: ONE_MONTH_MS,
});

async function getCities(): Promise<CitiesPayload> {
  const cached = citiesCache.get(CITIES_CACHE_KEY);

  if (cached) {
    //console.log(`Cache Hit: getCities`);
    return cached;
  }

  const res = await fetch(API_URL, { tls: { rejectUnauthorized: false } });

  if (!res.ok) {
    throw new Error(`Request Failed: ${res.status}`);
  }

  const html = await res.text();

  const $ = cheerio.load(html);

  const rows = $("select[name='CityID'] > option");

  const cities: CitiesPayload = { cities: [] };

  rows.each((_, element) => {
    const cityName = $(element).text();
    const cityId = $(element).attr("value");

    if (cityId !== undefined) {
      cities.cities.push({ cityId: parseInt(cityId!), cityName: cityName });
    }
  });

  citiesCache.set(CITIES_CACHE_KEY, cities);

  return cities;
}

export default getCities;
