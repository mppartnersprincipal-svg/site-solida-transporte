import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que o Turbopack detecte lockfiles fora do projeto como raiz
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
