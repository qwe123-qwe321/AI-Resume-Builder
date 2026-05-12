import React from "react";
import { ResumeInfo } from "@/context/ResumeInfoContext";

interface SummeryPreviewProps {
  resumeInfo: ResumeInfo | null;
}

function SummeryPreview({ resumeInfo }: SummeryPreviewProps) {
  return <p className="text-xs">{resumeInfo?.summery}</p>;
}

export default SummeryPreview;