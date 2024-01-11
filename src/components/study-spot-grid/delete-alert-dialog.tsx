import { useState } from "react";

import { api } from "@/trpc/react";

import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ServerErrorMessage from "../server-error-message";

const DeleteAlertDialog = ({
  id,
  className,
}: {
  id: number;
  className: string;
}) => {
  const [token] = useState(sessionStorage.getItem("sadfrogs_admin") ?? "");

  const apiUtils = api.useUtils();
  const {
    mutate: deleteSpot,
    isLoading: deleteLoading,
    error: deleteError,
  } = api.studySpot.delete.useMutation({
    onSuccess: () => apiUtils.studySpot.getAll.invalidate(),
  });

  return (
    <>
      <AlertDialog>
        <div className="flex gap-4">
          <AlertDialogTrigger asChild>
            <Button
              className={className}
              disabled={deleteLoading}
              variant="destructive"
            >
              {deleteLoading ? (
                "Deleting..."
              ) : (
                <>
                  Delete <Trash2 className="ml-1 h-4" />
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                Study Spot and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteSpot({ id, token })}>
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          <ServerErrorMessage
            message={deleteError?.message}
            code={deleteError?.data?.code}
            // className="mt-4"
          />
        </div>
      </AlertDialog>
    </>
  );
};

export default DeleteAlertDialog;
