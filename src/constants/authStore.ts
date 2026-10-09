// ──────────────────────────────────────────────────────────────
// Simple in-memory auth store (no persistence — demo only)
// Replace with SecureStore + a real backend for production.
// ──────────────────────────────────────────────────────────────
import type { User } from './connectHubData';

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const state: AuthState = {
  user: null,
  isLoggedIn: false,
};

export const AuthStore = {
  /** Log in — sets the global user */
  login(user: User) {
    state.user = user;
    state.isLoggedIn = true;
  },

  /** Log out — clears the global user */
  logout() {
    state.user = null;
    state.isLoggedIn = false;
  },

  /** Get the currently logged-in user (null if not logged in) */
  getUser(): User | null {
    return state.user;
  },

  /** Check if the current user is admin */
  isAdmin(): boolean {
    return state.user?.role === 'admin';
  },
};
