import { useQuery } from "@tanstack/react-query";
import { getEducation } from "@/services/profileApi";
import EducationCard from "./EducationCard";

/**
 * Sección de formación para la Home.
 * Stacking effect: primera card sticky; la segunda hace scroll por encima de la primera.
 */
export default function EducationSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["education"],
    queryFn: getEducation
  });

  if (isLoading || !data?.length) return null;

  return (
    <div className="education-section">
      {data.map((item, index) => (
        <EducationCard
          key={item.id}
          item={item}
          index={index}
          sticky={index === 0}
          stacksOnTop={index > 0}
        />
      ))}
    </div>
  );
}
