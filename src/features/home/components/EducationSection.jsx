import { useQuery } from "@tanstack/react-query";
import { getEducation } from "@/services/profileApi";
import EducationCard from "./EducationCard";
import EducationPocket from "./EducationPocket";

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
      <div className="education-section__cards">
        {data.map((item, index) => (
          <EducationPocket key={item.id} index={index}>
            <EducationCard item={item} index={index} total={data.length} />
          </EducationPocket>
        ))}
      </div>
    </div>
  );
}
