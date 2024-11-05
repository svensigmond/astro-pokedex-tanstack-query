import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const capitalizeFirstLetter = (value: string): string => {
	return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};
