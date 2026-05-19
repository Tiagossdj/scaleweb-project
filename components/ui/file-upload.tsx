"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  onFile: (file: File) => void;
  className?: string;
  label?: string;
}

export function FileUpload({
  accept = ".csv,.xlsx,.xls",
  onFile,
  className,
  label = "Arraste um arquivo CSV ou Excel, ou clique para selecionar",
}: FileUploadProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 p-10 transition-colors hover:border-primary hover:bg-muted/40",
        className
      )}
    >
      <Upload className="h-10 w-10 text-muted-foreground" />
      <span className="text-center text-sm text-muted-foreground">{label}</span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </label>
  );
}
