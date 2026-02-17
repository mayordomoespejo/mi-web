// Datos desde mocks locales (sin API real ni simulaciones de red)
import experience from "@/mocks/experience.json";
import education from "@/mocks/education.json";

/**
 * Devuelve la lista de experiencia laboral.
 * @returns {Promise<Array<{ id: string; company: string; role: string; roleKey?: string; startDate: string; endDate: string; responsibilities?: string[]; responsibilityKey?: string }>>}
 */
export function getExperience() {
  return Promise.resolve(experience);
}

/**
 * Devuelve la lista de formación académica.
 * @returns {Promise<Array<{ id: string; title: string; center: string; dates: string }>>}
 */
export function getEducation() {
  return Promise.resolve(education);
}
