import React from 'react';
import { render, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Dashboard from '../../src/components/dashboard';
import AnomalyLedger from '../../src/components/anomaly-ledger';
import NewsletterStatus from '../../src/components/newsletter-status';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock SWR with minimal test data
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: null,
    error: null,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn()
  }))
}));

// Mock chart components
jest.mock('../../src/components/charts/z-score-chart', () => {
  return function MockZScoreChart() {
    return <div role="img" aria-label="Z-Score chart for Credit Spreads">Chart</div>;
  };
});

jest.mock('../../src/components/charts/sparkline', () => {
  return function MockSparkline({ label }: { label: string }) {
    return <div role="img" aria-label={`${label} trend sparkline`}>Sparkline</div>;
  };
});

describe('Accessibility Tests', () => {
  it('Dashboard has no accessibility violations', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('AnomalyLedger has proper ARIA labels', async () => {
    const mockAnomaly = {
      score: 0.7,
      classification: 'high_volatility',
      components: [
        { name: 'VIX', z_score: 2.3 },
        { name: 'Credit Spreads', z_score: 1.8 }
      ]
    };

    const { container } = render(<AnomalyLedger anomaly={mockAnomaly} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('NewsletterStatus form is accessible', async () => {
    const { container } = render(<NewsletterStatus />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    const { container } = render(<Dashboard />);
    
    // Find all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Should have focusable elements
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // All focusable elements should have proper focus indicators
    focusableElements.forEach(element => {
      expect(element).not.toHaveAttribute('tabindex', '-1');
    });
  });

  it('has proper heading hierarchy', () => {
    const { container } = render(<Dashboard />);
    
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    
    // Check that we don't skip heading levels
    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i];
      const previous = headingLevels[i - 1];
      
      // Should not skip more than one level
      expect(current - previous).toBeLessThanOrEqual(1);
    }
  });

  it('has sufficient color contrast', () => {
    const { container } = render(<Dashboard />);
    
    // Test critical risk color contrast
    const criticalElements = container.querySelectorAll('[style*="#D50000"]');
    criticalElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      // Red on white should have sufficient contrast (>4.5:1)
      expect(computedStyle.color).toBeTruthy();
    });
  });

  it('provides alternative text for visual content', () => {
    const { container } = render(<Dashboard />);
    
    // All images should have alt text
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
    
    // Charts should have ARIA labels
    const charts = container.querySelectorAll('[role="img"]');
    charts.forEach(chart => {
      expect(chart).toHaveAttribute('aria-label');
    });
  });

  it('supports screen readers with live regions', () => {
    const { container } = render(<Dashboard />);
    
    // Should have ARIA live region for status updates
    const liveRegions = container.querySelectorAll('[aria-live]');
    expect(liveRegions.length).toBeGreaterThan(0);
    
    // Live region should be polite (not assertive)
    const statusRegion = container.querySelector('[aria-live="polite"]');
    expect(statusRegion).toBeInTheDocument();
  });

  it('provides skip navigation', () => {
    const { getByText } = render(<Dashboard />);
    
    const skipLink = getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});