"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DeletePolicyButtonProps {
  policyId: string;
  fileName: string;
  filePath: string;
}

export default function DeletePolicyButton({
  policyId,
  fileName,
  filePath,
}: DeletePolicyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();

      // 1. Delete file from storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("policy-documents")
          .remove([filePath]);
        if (storageError) console.warn("Storage delete:", storageError);
      }

      // 2. Delete analysis
      await supabase
        .from("policy_analyses")
        .delete()
        .eq("policy_id", policyId);

      // 3. Delete policy record
      const { error } = await supabase
        .from("policies")
        .delete()
        .eq("id", policyId);

      if (error) throw error;

      toast.success("Policy deleted");
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600 font-medium whitespace-nowrap hidden sm:block">
          Delete "{fileName.slice(0, 15)}{fileName.length > 15 ? "…" : ""}"?
        </span>
        <Button
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs h-7 px-2.5 shrink-0"
        >
          {isDeleting ? (
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : "Delete"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="rounded-lg text-xs h-7 px-2.5 shrink-0"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setShowConfirm(true)}
      title="Delete policy"
      className="rounded-lg h-8 w-8 p-0 text-gray-300 hover:text-red-600 hover:bg-red-50 shrink-0"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}