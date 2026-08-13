import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/assets/cv/aditya-bholla-resume.docx",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Aditya-Bholla-Resume.docx"',
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
