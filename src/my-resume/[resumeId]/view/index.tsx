import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/Button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ResumeInfo } from "@/context/ResumeInfoContext";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../service/GlobalApi";
import { toast } from "sonner";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const { resumeId } = useParams<{ resumeId: string }>();

  useEffect(() => {
    GetResumeInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId).then((resp) => {
      console.log(resp.data.data);
      setResumeInfo(resp.data.data);
    });
  };

  const HandleDownload = () => {
    window.print();
  };

  const copyToClipboard = async () => {
    const shareUrl =
      (import.meta.env.VITE_BASE_URL || window.location.origin) +
      "/my-resume/" +
      resumeId +
      "/view";
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    }
  };

  const HandleShare = async () => {
    const shareUrl =
      (import.meta.env.VITE_BASE_URL || window.location.origin) +
      "/my-resume/" +
      resumeId +
      "/view";
    const shareTitle =
      (resumeInfo?.firstName ?? "") +
      " " +
      (resumeInfo?.lastName ?? "") +
      " resume";
    const shareText = "Hello Everyone, This is my resume please open url to see it";

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
          url: shareUrl,
          title: shareTitle,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error sharing:", err);
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Ultimate AI generates Resume is ready !
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download your resume and you can share unique
            resume url with your friends and family
          </p>
          <div className="flex justify-between px-44 my-10">
            <Button onClick={HandleDownload}>Download</Button>

            <Button onClick={HandleShare}>Share</Button>
          </div>
        </div>
      </div>
      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;