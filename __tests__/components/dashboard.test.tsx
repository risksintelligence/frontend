import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import Dashboard from '../../src/components/dashboard';

// Simple mock for SWR to provide test data
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock chart components to avoid recharts SSR issues
jest.mock('../../src/components/charts/z-score-chart', () => {
  return function MockZScoreChart() {
    return <div data-testid="z-score-chart">Z-Score Chart</div>;
  };
});

jest.mock('../../src/components/charts/sparkline', () => {
  return function MockSparkline() {
    return <div data-testid="sparkline">Sparkline</div>;
  };
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Reset all mocks and provide default SWR behavior
    jest.clearAllMocks();
    
    const useSWR = require('swr').default;
    useSWR.mockImplementation(() => ({
      data: null,
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn()
    }));
  });

  it('renders loading state correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Loading resilience insight...')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Dashboard />);
    
    // Check for skip link
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    
    // Check for main landmark
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for ARIA live region
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('renders all dashboard sections', () => {
    const useSWR = require('swr').default;
    
    // Mock successful data responses
    useSWR.mockImplementation((key: string) => {
      const mockData = {
        'geri': {
          data: {
            score: 65,
            band: 'high',
            band_color: '#FFAB00',
            change_24h: 2.3,
            confidence: 0.87,
            drivers: [
              { component: 'Credit Spreads', contribution: 12, impact: 2.1 },
              { component: 'VIX', contribution: 8, impact: 1.8 }
            ]
          }
        },
        'regime': {
          data: { regime: 'Financial_Stress', confidence: 0.73 }
        },
        'anomaly': {
          data: { score: 0.3, classification: 'stable' }
        }
      };
      
      return mockData[key] || { data: null };
    });
    
    act(() => {
      render(<Dashboard />);
    });
    
    // Check for key dashboard sections
    expect(screen.getByText(/RRIO Intelligence Brief/i)).toBeInTheDocument();
    expect(screen.getByText(/Partner Labs & Media/i)).toBeInTheDocument();
    expect(screen.getByText(/Resilience Activation Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Scenario Studio/i)).toBeInTheDocument();
  });

  it('displays Bloomberg-grade narrative when data is available', async () => {
    const useSWR = require('swr').default;
    
    useSWR.mockImplementation((key: string) => {
      if (key === 'geri') {
        return {
          data: {
            score: 72,
            band: 'high',
            band_color: '#FFAB00',
            change_24h: 3.2,
            confidence: 0.91,
            drivers: [
              { component: 'Credit Spreads', contribution: 15, impact: 3.1 },
              { component: 'VIX', contribution: 10, impact: 2.4 }
            ]
          }
        };
      }
      return { data: null };
    });
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Credit Spreads.*pressuring GRII/)).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation properly', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    
    // Test skip link
    const skipLink = screen.getByText('Skip to main content');
    await user.tab();
    expect(skipLink).toHaveFocus();
    
    await user.keyboard('[Enter]');
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('supports high contrast mode', () => {
    // Mock high contrast preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(<Dashboard />);
    
    // Component should render without errors in high contrast mode
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('supports reduced motion preference', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(<Dashboard />);
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});