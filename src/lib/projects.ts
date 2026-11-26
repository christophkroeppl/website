export const FEATURED_PROJECT_COUNT = 3

export function splitProjects<T>(projects: T[]): { featured: T[]; remaining: T[] } {
  return {
    featured: projects.slice(0, FEATURED_PROJECT_COUNT),
    remaining: projects.slice(FEATURED_PROJECT_COUNT),
  }
}

export function projectPosition(offset: number, index: number): number {
  return offset + index + 1
}
