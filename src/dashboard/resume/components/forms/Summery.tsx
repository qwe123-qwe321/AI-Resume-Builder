import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../service/GlobalApi";
import { Brain, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { AIChatSession } from "./../../../../../service/AIModal";

interface SummeryProps {
  enabledNext: (v: boolean) => void;
}

interface AiSummeryItem {
  summary?: string;
  experience_level?: string;
}

const prompt =
  "Job Title: {jobTitle} , Return ONLY a valid JSON array with 3 objects. Each object has 'summary' (3-4 lines) and 'experience_level' (Fresher, Mid Level, Senior Level) fields. NO extra text, NO markdown, NO explanation.";

function Summery({ enabledNext }: SummeryProps) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const params = useParams<{ resumeId: string }>();
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] =
    useState<AiSummeryItem[]>();

  useEffect(() => {
    summery &&
      setResumeInfo({
        ...resumeInfo,
        summery: summery,
      });
  }, [summery]);

  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle ?? "");
    console.log(PROMPT);
    const result = await AIChatSession.sendMessage(PROMPT);
    let text = result.response.text();
    console.log("AI Response:", text);

    try {
      let cleanedText = text;

      // 尝试提取 JSON 数组部分
      const jsonStart = cleanedText.indexOf('[');
      const jsonEnd = cleanedText.lastIndexOf(']');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
      }

      // 清理 markdown 代码块标记
      cleanedText = cleanedText.replace(/```json\s*|\s*```/g, "").trim();
      
      console.log("Cleaned JSON:", cleanedText);
      const parsed = JSON.parse(cleanedText);
      console.log("Parsed JSON:", parsed);
      setAiGenerateSummeryList(parsed);
    } catch (error) {
      console.error("JSON parsing failed:", error);
      toast("Failed to generate summary, please try again");
    } finally {
      setLoading(false);
    }
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const data = {
      data: {
        summery: summery,
      },
    };
    GlobalApi.UpdateResumeDetail(params?.resumeId ?? "", data).then(
      (resp) => {
        console.log(resp);
        enabledNext(true);
        setLoading(false);
        toast("Details updated");
      },
      (error) => {
        setLoading(false);
      }
    );
  };
  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summery</h2>
        <p>Add Summery for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summery</label>
            <Button
              variant="outline"
              onClick={() => GenerateSummeryFromAI()}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>
          <Textarea
            className="mt-5"
            required
            value={summery}
            defaultValue={summery ? summery : resumeInfo?.summery}
            onChange={(e) => setSummery(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummeryList?.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummery(item?.summary ?? "")}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
            >
              <h2 className="font-bold my-1 text-primary">
                Level: {item?.experience_level}
              </h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summery;