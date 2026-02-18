import { useQuery } from "@tanstack/react-query";
import { getEducation } from "@/services/profileApi";
import EducationCard from "./EducationCard";

/**
 * Education section for the Home page.
 * Vertical carousel: each card is sticky and the next one stacks on top on scroll.
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
        <EducationCard key={item.id} item={item} index={index} total={data.length} />
      ))}
    </div>
  );
}
