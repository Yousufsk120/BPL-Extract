// Utility functions for Bengal Political Lab
import { clsx, type ClassValue } from 'clsx';

// Utility for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format numbers with Indian numbering system
export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

// Calculate percentage with specified decimal places
export function calculatePercentage(part: number, total: number, decimals: number = 2): number {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(decimals));
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Color utilities for political parties
export const partyColors: { [key: string]: string } = {
  'AITC': '#20C997',
  'BJP': '#FF9933', 
  'INC': '#19AAED',
  'CPM': '#DC143C',
  'CPI': '#FF0000',
  'AAP': '#0066FF',
  'BSP': '#22409A',
  'SP': '#FF2222',
  'NOTA': '#808080',
  'Independent': '#666666'
};

export function getPartyColor(partyCode: string): string {
  return partyColors[partyCode] || '#8884d8';
}

// Date formatting utilities
export function formatElectionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Election year validation
export function isValidElectionYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= 1950 && year <= currentYear;
}