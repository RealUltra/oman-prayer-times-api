import { Hono } from "hono";
import getCities from "../api/getCities";
import getCity from "../api/getCity";
import { validateCityId } from "../utils/validation";

const citiesRoute = new Hono();

citiesRoute.get("/cities", async (c) => {
  const rawCityId = c.req.query("cityId");

  if (rawCityId === undefined) {
    return c.json(await getCities());
  }

  const cityId = validateCityId(rawCityId);

  if (!cityId.ok) {
    return c.json({ error: cityId.message }, 400);
  }

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

  return c.json(city);
});

export default citiesRoute;
