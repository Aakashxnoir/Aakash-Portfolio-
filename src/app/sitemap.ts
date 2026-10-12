import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { nav, siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...nav.map((link) => link.href),
    ...projects.map((project) => `/work/${project.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
