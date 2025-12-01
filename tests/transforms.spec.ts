import { test, expect } from "@playwright/test";
import { normalizeForecastHistory, normalizeAnomalyHistory } from "@/lib/transforms";

test("normalizeForecastHistory fills lower/upper and numbers", () => {
  const normalized = normalizeForecastHistory({
    history: [
      { timestamp: "2024-01-01T00:00:00Z", predicted: "2.5" as unknown as number, realized: "1.0" as unknown as number },
    ],
  });

  expect(normalized).toHaveLength(1);
  expect(normalized[0].predicted).toBe(2.5);
  expect(normalized[0].realized).toBe(1.0);
  expect(normalized[0].lower).toBeCloseTo(1.5);
  expect(normalized[0].upper).toBeCloseTo(3.5);
});

test("normalizeAnomalyHistory coerces score to number", () => {
  const normalized = normalizeAnomalyHistory({
    history: [
      { timestamp: "2024-01-01T00:00:00Z", score: "0.6" as unknown as number, classification: "spike", severity: "high" },
    ],
  });

  expect(normalized[0].score).toBeCloseTo(0.6);
  expect(normalized[0].classification).toBe("spike");
  expect(normalized[0].severity).toBe("high");
});
