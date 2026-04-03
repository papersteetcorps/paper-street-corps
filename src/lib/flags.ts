/** Feature flags — flip these to enable/disable features site-wide */

export const FLAGS = {
  /** When false, all login/signup UI is hidden and auth pages redirect to home */
  AUTH_ENABLED: false,
  /** When false, dev-only features like "Fill Demo Data" are hidden */
  DEV_MODE: false,
} as const;   