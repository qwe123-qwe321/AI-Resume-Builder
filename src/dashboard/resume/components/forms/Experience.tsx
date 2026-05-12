import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../service/GlobalApi";
import { toast } from "sonner";
import RichTextEditor from "../RichTextEditor";

interface ExperienceItem {
  id?: number;
  title?: string;
  companyName?: string;
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  workSummery?: string;
}

function Experience() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams<{ resumeId: string }>();
  const [loading, setLoading] = useState(false);
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([
    {
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      workSummery: "",
    },
  ]);

  useEffect(() => {
    if (resumeInfo?.experience && Array.isArray(resumeInfo?.experience)) {
      setExperienceList(resumeInfo?.experience);
    }
  }, []);

  // 实时同步到 resumeInfo
  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      experience: experienceList,
    });
  }, [experienceList, setResumeInfo]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newExperienceList = [...experienceList];
    const { name, value } = e.target;
    newExperienceList[index] = {
      ...newExperienceList[index],
      [name]: value,
    };
    setExperienceList(newExperienceList);
  };

  const handleWorkSummaryChange = (
    index: number,
    e: { target: { value: string } }
  ) => {
    const newExperienceList = [...experienceList];
    newExperienceList[index] = {
      ...newExperienceList[index],
      workSummery: e.target.value,
    };
    setExperienceList(newExperienceList);
  };

  const AddNewExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        title: "",
        companyName: "",
        city: "",
        state: "",
        startDate: "",
        endDate: "",
        workSummery: "",
      },
    ]);
  };

  const RemoveExperience = () => {
    setExperienceList((prev) => prev.slice(0, -1));
  };

  const onSave = () => {
    setLoading(true);
    const experienceWithoutId = experienceList.map(({ id, ...rest }) => rest);
    const data = {
      data: {
        experience: experienceWithoutId,
      },
    };
    GlobalApi.UpdateResumeDetail(params?.resumeId ?? "", data).then(
      (resp) => {
        console.log(resp);
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
        <h2 className="font-bold text-lg">Experience</h2>
        <p>Add your previous experience</p>

        <div>
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 mt-5 border p-3 rounded-lg">
                <div>
                  <label className="text-xs">Position Title</label>
                  <Input
                    name="title"
                    defaultValue={item?.title}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-xs">Company Name</label>
                  <Input
                    name="companyName"
                    defaultValue={item?.companyName}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-xs">City</label>
                  <Input
                    name="city"
                    defaultValue={item?.city}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-xs">State</label>
                  <Input
                    name="state"
                    defaultValue={item?.state}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-xs">Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    defaultValue={item?.startDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-xs">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    defaultValue={item?.endDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div className="col-span-2">
                  <RichTextEditor
                    index={index}
                    defaultValue={item?.workSummery || ""}
                    onRichTextEditorChange={(e) => handleWorkSummaryChange(index, e)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={AddNewExperience}
              className="text-primary"
            >
              <Plus /> Add More
            </Button>
            <Button
              variant="outline"
              onClick={RemoveExperience}
              className="text-red-500"
            >
              <Trash2 /> Remove
            </Button>
          </div>
          <Button onClick={onSave} disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;