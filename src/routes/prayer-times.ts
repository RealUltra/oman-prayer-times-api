import { Hono } from "hono";
import getPrayerTimes from "../api/getPrayerTimes";
import getCity from "../api/getCity";
import {
  validateCityId,
  validateMonth,
  validateYear,
} from "../utils/validation";

const prayerTimesRoute = new Hono();

prayerTimesRoute.get("/prayer-times", async (c) => {
  const rawYear = c.req.query("year");
  const rawMonth = c.req.query("month");
  const rawCityId = c.req.query("cityId");

  // Validate queries
  const cityId = validateCityId(rawCityId);
  const year = validateYear(rawYear);
  const month = validateMonth(rawMonth);

  if (!cityId.ok) {
    return c.json({ error: cityId.message }, 400);
  }

  if (!year.ok) {
    return c.json({ error: year.message }, 400);
  }

  if (!month.ok) {
    return c.json({ error: month.message }, 400);
  }

  // Get city
  const city = await getCity(cityId.value);

  if (city === null) {
    return c.json(
      {
        error: "City not found",
        cityId: cityId.value,
      },
      404,
    );
  }

  // Prepare payload
  var payload: PrayerTimesPayload = {
    cityId: cityId.value,
    cityName: city.cityName,
    prayerTimes: {},
  };

  // All year
  if (month.value === undefined) {
    for (let monthNum = 1; monthNum <= 12; monthNum++) {
      payload.prayerTimes = {
        ...payload.prayerTimes,
        ...(await getPrayerTimes(year.value, monthNum, cityId.value)),
      };
    }
  }

  // Month only
  else {
    payload.prayerTimes = await getPrayerTimes(
      year.value,
      month.value,
      cityId.value,
    );
  }

  return c.json(payload);
});

export default prayerTimesRoute;
