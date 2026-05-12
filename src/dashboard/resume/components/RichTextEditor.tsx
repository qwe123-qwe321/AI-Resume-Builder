import { Button } from "@/components/ui/Button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import React, { useContext, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "./../../../../service/AIModal";
import { toast } from "sonner";

const PROMPT =
  "Position Title: {positionTitle}. Return ONLY valid HTML with 5-7 bullet points (using <ul> and <li>) for a resume experience summary. NO extra text, NO markdown, NO explanation, just HTML.";

interface RichTextEditorProps {
  onRichTextEditorChange: (e: { target: { value: string } }) => void;
  index: number;
  defaultValue: string;
}

function RichTextEditor({
  onRichTextEditorChange,
  index,
  defaultValue,
}: RichTextEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  const GenerateSummeryFromAI = async () => {
    if (!resumeInfo?.experience?.[index]?.title) {
      toast("Please Add Position Title");
      return;
    }
    setLoading(true);
    const prompt = PROMPT.replace(
      "{positionTitle}",
      resumeInfo.experience[index].title
    );

    try {
      const result = await AIChatSession.sendMessage(prompt);
      let resp = result.response.text();
      console.log("AI Response:", resp);
      
      // 尝试提取 HTML 内容（防止额外文字）
      const htmlStart = resp.indexOf('<ul');
      const htmlEnd = resp.lastIndexOf('</ul>');
      
      if (htmlStart !== -1 && htmlEnd !== -1 && htmlEnd > htmlStart) {
        resp = resp.substring(htmlStart, htmlEnd + 5);
      }
      
      // 清理可能的 markdown 标记
      resp = resp.replace(/```html\s*|\s*```/g, "").trim();
      
      console.log("Cleaned HTML:", resp);
      setValue(resp);
    } catch (error) {
      console.error("Failed to generate from AI:", error);
      toast("Failed to generate, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summery</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;