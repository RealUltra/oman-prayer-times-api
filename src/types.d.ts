type ISODateString = `${number}-${number}-${number}`;

type PrayerTimesByDate = Record<ISODateString, DailyPrayerTimes>;

type PrayerTimesPayload = {
  cityId: number;
  cityName: string;
  prayerTimes: PrayerTimesByDate;
};

type DailyPrayerTimes = {
  date: ISODateString;
  fajrTime: string;
  shurooqTime: string;
  dhuhrTime: string;
  asrTime: string;
  maghribTime: string;
  ishaaTime: string;
};

type City = {
  cityId: number;
  cityName: string;
};

type CitiesPayload = {
  cities: City[];
};

type ValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      message: string;
    };
