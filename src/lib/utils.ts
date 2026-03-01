import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Robust, fault-tolerant clipboard utility to handle permission blocks or non-secure environments.
 */
export async function copyToClipboard(text: string, toastTitle: string = "Copied to clipboard") {
  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API not available")
    }
    await navigator.clipboard.writeText(text)
    toast.success(toastTitle)
  } catch (err) {
    console.warn("Clipboard API failed, using fallback:", err)
    // Manual fallback for environments where clipboard API is blocked by permissions policy
    try {
      const response = window.prompt("The automated copy feature was blocked by the browser. Please copy the text below manually:", text)
      if (response !== null) {
        toast.success(toastTitle)
      } else {
        toast.error("Copy cancelled")
      }
    } catch (promptErr) {
      console.error("Manual fallback also failed:", promptErr)
      toast.error("Failed to copy text")
    }
  }
}