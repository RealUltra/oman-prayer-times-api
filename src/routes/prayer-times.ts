import type { FastifyPluginAsync } from "fastify";
import getPrayerTimes from "../api/getPrayerTimes";
import getCity from "../api/getCity";
import {
  validateCityId,
  validateMonth,
  validateYear,
} from "../utils/validation";

const prayerTimesRoute: FastifyPluginAsync = async (server) => {
  server.get<{
    Querystring: {
      year?: string;
      month?: string;
      cityId?: string;
    };
  }>("/prayer-times", async (request, reply) => {
    const { year: rawYear, month: rawMonth, cityId: rawCityId } = request.query;

    // Validate queries
    const cityId = validateCityId(rawCityId);
    const year = validateYear(rawYear);
    const month = validateMonth(rawMonth);

    if (!cityId.ok) {
      return reply.code(400).send({ error: cityId.message });
    }

    if (!year.ok) {
      return reply.code(400).send({ error: year.message });
    }

    if (!month.ok) {
      return reply.code(400).send({ error: month.message });
    }

    // Get city
    const city = await getCity(cityId.value);

    if (city === null) {
      return reply.code(404).send({
        error: "City not found",
        cityId: cityId.value,
      });
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

    return payload;
  });
};

export default prayerTimesRoute;
