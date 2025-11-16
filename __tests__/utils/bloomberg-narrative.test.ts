import { describe, it, expect } from '@jest/globals';

// Mock the narrative generation function
function generateBloombergNarrative(geri: any): string {
  const bandText = geri.band?.charAt(0).toUpperCase() + geri.band?.slice(1);
  const changeDirection = (geri.change_24h || 0) >= 0 ? 'climbed' : 'declined';
  const changeAmount = Math.abs(geri.change_24h || 0).toFixed(1);
  const topDrivers = geri.drivers?.slice(0, 2);
  
  const driverText = topDrivers?.length 
    ? topDrivers.map((d: any) => {
        const verb = d.impact > 0 ? 'pressured' : 'supported';
        return `${d.component.toLowerCase()} ${verb} by ${Math.abs(d.impact).toFixed(1)}bp`;
      }).join(' while ')
    : 'mixed component signals';

  return `GRII ${changeDirection} ${changeAmount} points to ${geri.score} (${bandText} Risk, ${geri.band_color}) as ${driverText}. Confidence: ${Math.round((geri.confidence || 0.85) * 100)}%.`;
}

describe('Bloomberg Narrative Generation', () => {
  it('generates proper narrative for rising GRII', () => {
    const geri = {
      score: 68,
      band: 'high',
      band_color: '#FFAB00',
      change_24h: 2.5,
      confidence: 0.87,
      drivers: [
        { component: 'Credit Spreads', impact: 2.1 },
        { component: 'VIX', impact: 1.8 }
      ]
    };

    const narrative = generateBloombergNarrative(geri);
    
    expect(narrative).toContain('GRII climbed 2.5 points');
    expect(narrative).toContain('68 (High Risk');
    expect(narrative).toContain('credit spreads pressured by 2.1bp');
    expect(narrative).toContain('vix pressured by 1.8bp');
    expect(narrative).toContain('Confidence: 87%');
  });

  it('generates proper narrative for declining GRII', () => {
    const geri = {
      score: 45,
      band: 'moderate',
      band_color: '#FFD600',
      change_24h: -1.8,
      confidence: 0.82,
      drivers: [
        { component: 'Supply Chain', impact: -1.2 },
        { component: 'Energy', impact: -0.9 }
      ]
    };

    const narrative = generateBloombergNarrative(geri);
    
    expect(narrative).toContain('GRII declined 1.8 points');
    expect(narrative).toContain('45 (Moderate Risk');
    expect(narrative).toContain('supply chain supported by 1.2bp');
    expect(narrative).toContain('energy supported by 0.9bp');
  });

  it('handles missing data gracefully', () => {
    const geri = {
      score: 50,
      band: 'moderate',
      band_color: '#FFD600',
      change_24h: -0.1 // Small negative change to test "declined"
    };

    const narrative = generateBloombergNarrative(geri);
    
    expect(narrative).toContain('GRII declined 0.1 points');
    expect(narrative).toContain('mixed component signals');
    expect(narrative).toContain('Confidence: 85%');
  });

  it('uses proper financial language verbs', () => {
    const geri = {
      score: 72,
      band: 'high',
      band_color: '#FFAB00',
      change_24h: 3.2,
      confidence: 0.91,
      drivers: [
        { component: 'Credit Spreads', impact: 2.5 },
        { component: 'VIX', impact: 1.9 }
      ]
    };

    const narrative = generateBloombergNarrative(geri);
    
    // Should use "climbed" for positive change
    expect(narrative).toContain('climbed');
    // Should use "pressured" for positive impact
    expect(narrative).toContain('pressured');
    // Should include basis points notation
    expect(narrative).toContain('bp');
  });

  it('formats confidence as percentage', () => {
    const geri = {
      score: 58,
      band: 'moderate',
      band_color: '#FFD600',
      change_24h: 1.1,
      confidence: 0.93
    };

    const narrative = generateBloombergNarrative(geri);
    
    expect(narrative).toContain('Confidence: 93%');
  });
});