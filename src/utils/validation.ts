function validateIntegerParam(
  name: string,
  value: string | undefined,
  fallback?: number,
): ValidationResult<number> {
  if (value === undefined) {
    if (fallback !== undefined) {
      return { ok: true, value: fallback };
    }

    return { ok: false, message: `${name} is required` };
  }

  if (!/^\d+$/.test(value)) {
    return { ok: false, message: `${name} must be an integer` };
  }

  return { ok: true, value: Number(value) };
}

export function validateYear(
  value: string | undefined,
): ValidationResult<number> {
  const currentYear = new Date(Date.now()).getFullYear();
  return validateIntegerParam("year", value, currentYear);
}

export function validateMonth(
  value: string | undefined,
): ValidationResult<number | undefined> {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }

  const parsed = validateIntegerParam("month", value);

  if (!parsed.ok) return parsed;

  if (parsed.value < 1 || parsed.value > 12) {
    return { ok: false, message: "month must be between 1 and 12" };
  }

  return parsed;
}

export function validateDay(
  value: string | undefined,
): ValidationResult<number | undefined> {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }

  const parsed = validateIntegerParam("day", value);

  if (!parsed.ok) return parsed;

  if (parsed.value < 1 || parsed.value > 31) {
    return { ok: false, message: "day must be between 1 and 31" };
  }

  return parsed;
}

export function validateCityId(
  value: string | undefined,
): ValidationResult<number> {
  return validateIntegerParam("cityId", value, 0);
}
