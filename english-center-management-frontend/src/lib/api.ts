import { getSession, signOut } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthToken = async () => {
  try {
    // Get from NextAuth session first
    const session = await getSession();
    if (session?.accessToken) {
      return session.accessToken;
    }

    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        return localToken;
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to handle token expiration
const handleTokenExpiration = async () => {
  console.log('Token expired, logging out...');

  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }

  // Sign out from NextAuth
  await signOut({
    callbackUrl: '/auth/login',
    redirect: true,
  });
};

// Helper function to check if error is due to token expiration
const isTokenExpiredError = (error: any): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('401') ||
      message.includes('unauthorized') ||
      message.includes('token') ||
      message.includes('expired') ||
      message.includes('invalid token')
    );
  }
  return false;
};

// Generic API client
export const api = {
  async get(endpoint: string) {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Check if it's a token expiration error
      if (response.status === 401 || isTokenExpiredError(errorText)) {
        await handleTokenExpiration();
        return;
      }

      throw errorText;
    }

    return response.json();
  },

  async post(endpoint: string, data?: any) {
    console.log('post');
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.json();

      // Check if it's a token expiration error
      if (response.status === 401 || isTokenExpiredError(errorText)) {
        await handleTokenExpiration();
        return;
      }

      throw errorText;
    }

    return response.json();
  },

  async put(endpoint: string, data?: any) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Check if it's a token expiration error
      if (response.status === 401 || isTokenExpiredError(errorText)) {
        await handleTokenExpiration();
        return;
      }

      throw errorText;
    }

    return response.json();
  },

  async delete(endpoint: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Check if it's a token expiration error
      if (response.status === 401 || isTokenExpiredError(errorText)) {
        await handleTokenExpiration();
        return;
      }

      throw errorText;
    }

    return response.json();
  },
};
