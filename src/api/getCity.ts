import getCities from "./getCities";

async function getCity(cityId: number): Promise<City | null> {
  const cities = await getCities();
  const filtered = cities.cities.filter((city) => city.cityId === cityId);
  return filtered[0] ?? null;
}

export default getCity;
