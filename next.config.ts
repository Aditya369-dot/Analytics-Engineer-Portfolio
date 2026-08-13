import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/assets/cv/aditya-bholla-resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Aditya-Bholla-Resume.pdf"',
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
