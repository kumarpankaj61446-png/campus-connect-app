
import { FileAnalysis } from "@/components/dashboard/FileAnalysis";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI File Analysis</h2>
      </div>

      <FileAnalysis />
    </div>
  );
}
