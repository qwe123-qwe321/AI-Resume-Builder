import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext } from "react";
import PersonalDetailPreview from "../components/preview/PersonalDetailPreview";
import SummeryPreview from "../components/preview/SummeryPreview";
import ExperiencePreview from "../components/preview/ExperiencePreview";
import EducationalPreview from "../components/preview/EducationalPreview";
import SkillsPreview from "../components/preview/SkillsPreview";

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);

  return (
    <div
      className="shadow-lg h-full p-14 border-t-20"
      style={{
        borderColor: resumeInfo?.themeColor,
      }}
    >
      {/* Personal Detail  */}
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      {/* Summery  */}
      <SummeryPreview resumeInfo={resumeInfo} />
      {/* Professional Experience  */}
      {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
        <ExperiencePreview resumeInfo={resumeInfo} />
      )}
      {/* Educational  */}
      {resumeInfo?.education && resumeInfo.education.length > 0 && (
        <EducationalPreview resumeInfo={resumeInfo} />
      )}
      {/* Skills  */}
      {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
        <SkillsPreview resumeInfo={resumeInfo} />
      )}
    </div>
  );
}

export default ResumePreview;