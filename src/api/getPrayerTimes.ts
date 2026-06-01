import * as cheerio from "cheerio";
import { API_URL, ONE_DAY_MS, PRAYER_TIMES_CACHE_SIZE } from "../constants";
import { LRUCache } from "lru-cache/raw";

const prayerTimesCache = new LRUCache<string, PrayerTimesByDate>({
  max: PRAYER_TIMES_CACHE_SIZE,
  ttl: ONE_DAY_MS,
});

async function getPrayerTimes(
  year?: number,
  month?: number,
  cityId?: number,
): Promise<PrayerTimesByDate> {
  const now = new Date(Date.now());
  year ??= now.getFullYear();
  month ??= now.getMonth() + 1;
  cityId ??= 0;

  const url = `${API_URL}?year=${year}&month=${month}&CityID=${cityId}`;
  const cacheKey = `${year}:${month}:${cityId}`;

  const cached = prayerTimesCache.get(cacheKey);

  if (cached) {
    //console.log(`Cache Hit: getPrayerTimes at ${cacheKey}`);
    return cached;
  }

  const res = await fetch(url, { tls: { rejectUnauthorized: false } });

  if (!res.ok) {
    throw new Error(`Request Failed: ${res.status}`);
  }

  const payload: PrayerTimesByDate = {};

  const html = await res.text();

  const $ = cheerio.load(html);

  const rows = $("table > tbody > tr").slice(1);

  rows.each((_, element) => {
    const columns = $(element).find("td");

    if (columns.length !== 7) return;

    const rawDate: string = $(columns[0]).text();
    const fajrTime: string = $(columns[1]).text();
    const sunriseTime: string = $(columns[2]).text();
    const dhuhrTime: string = $(columns[3]).text();
    const rawAsrTime: string = $(columns[4]).text();
    const rawMaghribTime: string = $(columns[5]).text();
    const rawIshaaTime: string = $(columns[6]).text();

    const date = formatDate(rawDate);
    const asrTime = convertToPM(rawAsrTime);
    const maghribTime = convertToPM(rawMaghribTime);
    const ishaaTime = convertToPM(rawIshaaTime);

    if (
      !(
        date &&
        fajrTime &&
        sunriseTime &&
        dhuhrTime &&
        asrTime &&
        maghribTime &&
        ishaaTime
      )
    ) {
      throw new Error("Could not fetch all the data!");
    }

    payload[date] = {
      date: date,
      fajrTime: fajrTime,
      shurooqTime: sunriseTime,
      dhuhrTime: dhuhrTime,
      asrTime: asrTime,
      maghribTime: maghribTime,
      ishaaTime: ishaaTime,
    };
  });

  prayerTimesCache.set(cacheKey, payload);

  return payload;
}

function formatDate(dateString: string): ISODateString | null {
  const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);

  if (!match) return null;

  const dayNum = parseInt(match[1]!);
  const month = parseInt(match[2]!);
  const year = parseInt(match[3]!);

  return `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}` as ISODateString;
}

function convertToPM(timeStr: string): string | null {
  const [hourText, minuteText] = timeStr.trim().split(":");
  let hour = Number(hourText);

  if (hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, "0")}:${minuteText!.padStart(2, "0")}`;
}

export default getPrayerTimes;
