import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "../components/ui/Button";
import { Plus, LoaderCircle } from "lucide-react";
import GlobalApi from "../../service/GlobalApi";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import ResumeCardItem from "./components/ResumeCardItem";

interface Resume {
  id: number;
  documentId?: string;
  title?: string;
  resumeId?: string;
  userEmail?: string;
  userName?: string;
  themeColor?: string;
  [key: string]: unknown;
}

function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [resumeList, setResumeList] = useState<Resume[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [resumeSummary, setResumeSummary] = useState("");

  useEffect(() => {
    user && GetUserResumes();
  }, [user]);

  const GetUserResumes = () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    GlobalApi.GetUserResumes(
      user.primaryEmailAddress.emailAddress
    ).then((resp) => {
      setResumeList(resp.data.data);
    });
  };

  const onCreate = () => {
    setLoading(true);
    const data = {
      data: {
        title: resumeTitle,
        resumeId: Date.now().toString(),
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      },
    };
    GlobalApi.CreateNewResume(data).then(
      (resp) => {
        setLoading(false);
        setOpenDialog(false);
        navigate(
          "/dashboard/resume/" + resp.data.data.documentId + "/edit"
        );
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p className="text-gray-600">Start Creating AI resume to your next Job role</p>
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10 gap-6"
      >
        <div
          className="hover:scale-105 transition-all hover:border-primary hover:shadow-md cursor-pointer border-2 border-dashed rounded-lg h-70 flex justify-center items-center bg-gray-50"
          onClick={() => setOpenDialog(true)}
        >
          <Plus className="w-10 h-10 text-gray-400" />
        </div>
        {resumeList.map((resume, index) => (
          <ResumeCardItem
            key={index}
            resume={resume}
            refreshData={GetUserResumes}
          />
        ))}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <Label>Resume Title</Label>
              <Input
                placeholder="Enter a title for your resume"
                className="my-2"
                onChange={(e) => setResumeTitle(e.target.value)}
              />
              <Label>Summary (Optional)</Label>
              <Textarea
                placeholder="Enter a brief summary"
                className="my-2"
                onChange={(e) => setResumeSummary(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex justify-end">
            <Button
              disabled={!resumeTitle || loading}
              onClick={onCreate}
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;