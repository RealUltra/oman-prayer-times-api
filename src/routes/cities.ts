import type { FastifyPluginAsync } from "fastify";
import getCities from "../api/getCities";
import getCity from "../api/getCity";
import { validateCityId } from "../utils/validation";

const citiesRoute: FastifyPluginAsync = async (server) => {
  server.get<{
    Querystring: {
      cityId?: string;
    };
  }>("/cities", async (request, reply) => {
    const { cityId: rawCityId } = request.query;

    if (rawCityId === undefined) {
      return getCities();
    }

    const cityId = validateCityId(rawCityId);

    if (!cityId.ok) {
      return reply.code(400).send({ error: cityId.message });
    }

    const city = await getCity(cityId.value);

    if (city === null) {
      return reply.code(404).send({
        error: "City not found",
        cityId: cityId.value,
      });
    }

    return city;
  });
};

export default citiesRoute;
