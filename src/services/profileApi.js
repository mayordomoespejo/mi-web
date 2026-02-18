// Data from local mocks (no real API or network simulation)
import experience from "@/mocks/experience.json";
import education from "@/mocks/education.json";

/**
 * Returns the list of work experience.
 * @returns {Promise<Array<{ id: string; company: string; role: string; roleKey?: string; startDate: string; endDate: string; responsibilities?: string[]; responsibilityKey?: string }>>}
 */
export function getExperience() {
  return Promise.resolve(experience);
}

/**
 * Returns the list of education/training.
 * @returns {Promise<Array<{ id: string; title: string; center: string; dates: string }>>}
 */
export function getEducation() {
  return Promise.resolve(education);
}
