import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { apps, siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...apps.map((app) => app.href),
    ...projects.map((project) => `/work/${project.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
