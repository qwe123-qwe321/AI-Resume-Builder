import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../service/GlobalApi";
import { toast } from "sonner";

interface SkillItem {
  id?: number;
  name?: string;
  rating?: number;
}

function Skills() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams<{ resumeId: string }>();
  const [loading, setLoading] = useState(false);
  const [skillsList, setSkillsList] = useState<SkillItem[]>([
    {
      name: "",
      rating: 0,
    },
  ]);

  useEffect(() => {
    if (resumeInfo?.skills && Array.isArray(resumeInfo?.skills)) {
      setSkillsList(resumeInfo?.skills);
    }
  }, []);

  // 实时同步到 resumeInfo
  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList,
    });
  }, [skillsList, setResumeInfo]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSkillsList = [...skillsList];
    const { name, value } = e.target;
    newSkillsList[index] = {
      ...newSkillsList[index],
      [name]: name === "rating" ? Number(value) : value,
    };
    setSkillsList(newSkillsList);
  };

  const AddNewSkill = () => {
    setSkillsList([...skillsList, { name: "", rating: 0 }]);
  };

  const RemoveSkill = () => {
    setSkillsList((prev) => prev.slice(0, -1));
  };

  const onSave = () => {
    setLoading(true);
    const skillsWithoutId = skillsList.map(({ id, ...rest }) => rest);
    const data = {
      data: {
        skills: skillsWithoutId,
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
        <h2 className="font-bold text-lg">Skills</h2>
        <p>Add your skills</p>

        <div>
          {skillsList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 mt-5 border p-3 rounded-lg">
                <div>
                  <label className="text-xs">Name</label>
                  <Input
                    name="name"
                    defaultValue={item?.name}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-xs">Rating</label>
                  <Input
                    type="number"
                    name="rating"
                    defaultValue={item?.rating}
                    onChange={(e) => handleChange(index, e)}
                    min={1}
                    max={5}
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
              onClick={AddNewSkill}
              className="text-primary"
            >
              <Plus /> Add More
            </Button>
            <Button
              variant="outline"
              onClick={RemoveSkill}
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

export default Skills;