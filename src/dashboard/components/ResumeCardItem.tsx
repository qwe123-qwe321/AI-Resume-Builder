import { Loader2Icon, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import GlobalApi from "./../../../service/GlobalApi";
import { toast } from "sonner";

interface ResumeItem {
  documentId?: string;
  title?: string;
  themeColor?: string;
  [key: string]: unknown;
}

interface ResumeCardItemProps {
  resume: ResumeItem;
  refreshData: () => void;
}

function ResumeCardItem({ resume, refreshData }: ResumeCardItemProps) {
  const navigation = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = () => {
    setLoading(true);
    GlobalApi.DeleteResumeById(resume.documentId).then(
      (resp) => {
        console.log(resp);
        toast("Resume Deleted!");
        refreshData();
        setLoading(false);
        setOpenAlert(false);
      },
      () => {
        setLoading(false);
      }
    );
  };

  const handleDownload = () => {
    navigation("/my-resume/" + resume.documentId + "/view");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="hover:scale-105 transition-all cursor-pointer">
      <Link to={"/dashboard/resume/" + resume.documentId + "/edit"}>
        <div
          className="p-8 bg-linear-to-b from-pink-100 via-purple-200 to-blue-200 h-60 rounded-t-lg border-t-4 flex items-center justify-center"
          style={{
            borderColor: resume?.themeColor || "#8b5cf6",
          }}
        >
          <div className="flex items-center justify-center">
            <img src="/cv.png" width={80} height={80} alt="Resume Preview" />
          </div>
        </div>
      </Link>
      <div
        className="border p-3 flex justify-between items-center text-white rounded-b-lg shadow-lg"
        style={{
          background: resume?.themeColor || "#8b5cf6",
        }}
      >
        <h2 className="text-sm font-medium truncate flex-1 mr-2">{resume.title}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-white/20 rounded p-1">
            <MoreVertical className="h-4 w-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigation(
                  "/dashboard/resume/" + resume.documentId + "/edit"
                )
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigation("/my-resume/" + resume.documentId + "/view")
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)} className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                resume and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? (
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                ) : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeCardItem;