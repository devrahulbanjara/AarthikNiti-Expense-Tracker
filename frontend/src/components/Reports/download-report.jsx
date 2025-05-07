"use client";

import { Download } from "lucide-react";

const DownloadReport = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 bg-[#065336] hover:bg-[#054328] text-white text-sm px-4 py-2 rounded-md cursor-pointer transition-all"
  >
    <Download className="h-4 w-4" />
    Download CSV
  </button>
);

export default DownloadReport;
