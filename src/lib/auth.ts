interface AuthConfig {
  apiKey?: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
}

class AuthManager {
  private config: AuthConfig = {};
  private refreshTimer?: NodeJS.Timeout;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('rrio_auth');
      if (stored) {
        this.config = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load auth from storage:', error);
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rrio_auth', JSON.stringify(this.config));
      } catch (error) {
        console.warn('Failed to save auth to storage:', error);
      }
    }
  }

  setApiKey(apiKey: string) {
    this.config.apiKey = apiKey;
    this.saveToStorage();
  }

  setJWT(token: string, refreshToken?: string, expiresIn?: number) {
    this.config.token = token;
    if (refreshToken) this.config.refreshToken = refreshToken;
    if (expiresIn) {
      this.config.expiresAt = Date.now() + (expiresIn * 1000);
    }
    this.saveToStorage();
    this.scheduleRefresh();
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (this.config.apiKey) {
      headers['X-RRIO-API-KEY'] = this.config.apiKey;
      headers['X-API-Key'] = this.config.apiKey; // backwards compatibility
    }
    
    if (this.config.token && !this.isTokenExpired()) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }
    
    return headers;
  }

  isAuthenticated(): boolean {
    return Boolean(this.config.apiKey || (this.config.token && !this.isTokenExpired()));
  }

  private isTokenExpired(): boolean {
    if (!this.config.expiresAt) return false;
    return Date.now() >= this.config.expiresAt - 60000; // Refresh 1 minute early
  }

  private async refreshToken(): Promise<boolean> {
    if (!this.config.refreshToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: this.config.refreshToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.setJWT(data.access_token, data.refresh_token, data.expires_in);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    this.logout();
    return false;
  }

  private scheduleRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (this.config.expiresAt) {
      const refreshTime = this.config.expiresAt - Date.now() - 120000; // 2 minutes early
      if (refreshTime > 0) {
        this.refreshTimer = setTimeout(() => {
          this.refreshToken();
        }, refreshTime);
      }
    }
  }

  logout() {
    this.config = {};
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rrio_auth');
    }
  }

  // For reviewer/admin access
  setReviewerKey(reviewerKey: string) {
    this.config = { apiKey: reviewerKey };
    this.saveToStorage();
  }
}

export const authManager = new AuthManager();

import React from 'react';

// React hook for auth state
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(authManager.isAuthenticated());

  React.useEffect(() => {
    const checkAuth = () => setIsAuthenticated(authManager.isAuthenticated());
    
    // Check auth state periodically
    const interval = setInterval(checkAuth, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    isAuthenticated,
    login: (apiKey?: string, token?: string, refreshToken?: string, expiresIn?: number) => {
      if (apiKey) authManager.setApiKey(apiKey);
      if (token) authManager.setJWT(token, refreshToken, expiresIn);
      setIsAuthenticated(true);
    },
    logout: () => {
      authManager.logout();
      setIsAuthenticated(false);
    },
    setReviewerKey: (key: string) => {
      authManager.setReviewerKey(key);
      setIsAuthenticated(true);
    }
  };
}
