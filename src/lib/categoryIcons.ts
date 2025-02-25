import { Brain, Image, Mic, Video, Code, Rocket, LucideIcon } from "lucide-react";

// Map of category names to Lucide icons
export const iconMap: Record<string, LucideIcon> = {
  "Language Models": Brain,
  "Language Model": Brain,
  "Chat": Brain,
  "Research": Brain,
  "AI Tools": Brain,
  "AI Agent": Brain,
  
  "Image Generation": Image,
  "Art": Image,
  
  "Audio & Speech": Mic,
  "Audio and Speech": Mic,
  
  "Video Generation": Video,
  
  "Development": Code,
  "AI Agent Framework": Code,
  
  "Productivity": Rocket,
  "AI Automation": Rocket
};

// Default icon to use if category doesn't have a mapping
export const defaultIcon = Rocket;

/**
 * Get the icon component for a category name
 * @param categoryName The name of the category
 * @returns The Lucide icon component for the category
 */
export const getCategoryIcon = (categoryName: string): LucideIcon => {
  return iconMap[categoryName] || defaultIcon;
};
