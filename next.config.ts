import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer embarque des dépendances Node (polices, zlib) : on le
  // laisse hors du bundle serveur pour éviter les erreurs de résolution au build.
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.aceternity.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
