/**
 * 🚀 Performance Optimizations
 * 
 * تحسينات الأداء الأساسية للمشروع
 */

import React, { Suspense, lazy, useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Lazy loading components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Boxes = lazy(() => import('./pages/Boxes'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading fallback
const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner"></div>
    <p>جاري التحميل...</p>
  </div>
);

// useDebounce
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// useThrottle
export const useThrottle = (callback, delay = 300) => {
  const ref = useRef(false);

  return useCallback((...args) => {
    if (!ref.current) {
      callback(...args);
      ref.current = true;
      setTimeout(() => { ref.current = false; }, delay);
    }
  }, [callback, delay]);
};

// useLocalStorage with JSON parsing
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// useIntersectionObserver for lazy loading
export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// useFetch with caching
const cache = new Map();

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cacheTime = 60000, refetchInterval } = options;

  const fetchData = useCallback(async () => {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      
      cache.set(url, { data: json, timestamp: Date.now() });
      
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, cacheTime]);

  useEffect(() => {
    fetchData();
    if (refetchInterval) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refetchInterval]);

  return { data, loading, error, refetch: fetchData };
};

export default { useDebounce, useThrottle, useLocalStorage, useIntersectionObserver, useFetch };