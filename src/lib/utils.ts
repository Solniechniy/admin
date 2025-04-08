import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Big from "big.js";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BASE = 10;
// Add ethereum to Window interface
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const parseTokenAmount = (
  value: string | number | Big,
  decimals: number
) =>
  Big(value)
    .mul(BASE ** decimals)
    .toFixed(0);

export const formatTokenAmount = (
  value: string | number | Big,
  decimals = 18,
  precision?: number
): string => Big(value).div(Big(BASE).pow(decimals)).toFixed(precision);
