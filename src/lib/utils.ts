
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseISO, isSameDay, isAfter, isBefore, addDays } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// Safe date parsing function to handle invalid dates
export function safeParseISO(dateString: string): Date | null {
  try {
    if (!dateString) return null;
    
    const date = parseISO(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}

// Check if a date is today or in the past (for module unlocking)
export function isDateUnlocked(unlockDate: string): boolean {
  try {
    const date = parseISO(unlockDate);
    const today = new Date();
    
    // Set both dates to midnight for fair comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Return true if unlock date is today or in the past
    return date <= today;
  } catch (error) {
    console.error("Error checking unlock date:", error);
    return false;
  }
}

// Calculate days passed since a specific date
export function daysSinceDate(dateString: string): number {
  try {
    const date = safeParseISO(dateString);
    if (!date) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error("Error calculating days:", error);
    return 0;
  }
}

// Calculate the expected unlock date for a module based on its index
export function getModuleUnlockDate(courseStartDate: string, moduleIndex: number): Date | null {
  try {
    const startDate = safeParseISO(courseStartDate);
    if (!startDate) return null;
    
    // Module 0 (first module) unlocks on day 1
    // Each subsequent module unlocks one day later
    return addDays(startDate, moduleIndex);
  } catch (error) {
    console.error("Error calculating module unlock date:", error);
    return null;
  }
}
