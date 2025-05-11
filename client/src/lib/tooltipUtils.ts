/**
 * Utility functions for handling field tooltips consistently across the application
 */

/**
 * Looks up a tooltip for a field name from a descriptions object in multiple formats
 * @param fieldName The field name to find a tooltip for
 * @param descriptions An object containing field descriptions keyed by field name
 * @returns The tooltip text or a default message
 */
export function findTooltip(fieldName: string, descriptions: Record<string, string>): string {
  // Try various formats of the field name
  return (
    descriptions[fieldName] || 
    descriptions[fieldName.toLowerCase()] || 
    descriptions[fieldName.toLowerCase().replace(/\s+/g, '')] ||
    descriptions[fieldName.toLowerCase().replace(/[-_]/g, '')] ||
    descriptions[fieldName.toLowerCase().replace(/[^a-z0-9]/g, '')] ||
    "Information about this field"
  );
}

/**
 * Checks if a tooltip exists for a given field name
 * @param fieldName The field name to check
 * @param descriptions An object containing field descriptions keyed by field name
 * @returns True if a tooltip exists, false otherwise
 */
export function hasTooltip(fieldName: string, descriptions: Record<string, string>): boolean {
  return !!(
    descriptions[fieldName] || 
    descriptions[fieldName.toLowerCase()] || 
    descriptions[fieldName.toLowerCase().replace(/\s+/g, '')] ||
    descriptions[fieldName.toLowerCase().replace(/[-_]/g, '')] ||
    descriptions[fieldName.toLowerCase().replace(/[^a-z0-9]/g, '')]
  );
}