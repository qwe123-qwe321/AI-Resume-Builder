import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../service/GlobalApi";
import { toast } from "sonner";

interface EducationItem {
  id?: number;
  universityName?: string;
  degree?: string;
  major?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

function Education() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams<{ resumeId: string }>();
  const [loading, setLoading] = useState(false);
  const [educationList, setEducationList] = useState<EducationItem[]>([
    {
      universityName: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  useEffect(() => {
    if (resumeInfo?.education && Array.isArray(resumeInfo?.education)) {
      setEducationList(resumeInfo?.education);
    }
  }, []);

  // 实时同步到 resumeInfo
  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      education: educationList,
    });
  }, [educationList, setResumeInfo]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newEducationList = [...educationList];
    const { name, value } = e.target;
    newEducationList[index] = {
      ...newEducationList[index],
      [name]: value,
    };
    setEducationList(newEducationList);
  };

  const AddNewEducation = () => {
    setEducationList([
      ...educationList,
      {
        universityName: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const RemoveEducation = () => {
    setEducationList((prev) => prev.slice(0, -1));
  };

  const onSave = () => {
    setLoading(true);
    const educationWithoutId = educationList.map(({ id, ...rest }) => rest);
    const data = {
      data: {
        education: educationWithoutId,
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
        <h2 className="font-bold text-lg">Education</h2>
        <p>Add your educational details</p>

        <div>
          {educationList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 mt-5 border p-3 rounded-lg">
                <div className="col-span-2">
                  <label className="text-xs">University Name</label>
                  <Input
                    name="universityName"
                    defaultValue={item?.universityName}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-xs">Degree</label>
                  <Input
                    name="degree"
                    defaultValue={item?.degree}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-xs">Major</label>
                  <Input
                    name="major"
                    defaultValue={item?.major}
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
                  <label className="text-xs">Description</label>
                  <Textarea
                    name="description"
                    defaultValue={item?.description}
                    onChange={(e) => handleChange(index, e)}
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
              onClick={AddNewEducation}
              className="text-primary"
            >
              <Plus /> Add More
            </Button>
            <Button
              variant="outline"
              onClick={RemoveEducation}
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

export default Education;