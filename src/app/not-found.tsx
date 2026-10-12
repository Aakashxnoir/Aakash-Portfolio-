import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import EnterTitle from "@/components/EnterTitle";
import PageHeader from "@/components/PageHeader";
import { labels } from "@/content/site";

export const metadata: Metadata = { title: labels.notFound };

export default function NotFound() {
  return (
    <Container>
      <PageHeader label="404">
        <EnterTitle className="type-display mt-8 text-title font-bold text-text">
          {labels.notFound}
        </EnterTitle>
        <Link href="/" className="link-primary mt-14 inline-block">
          {labels.home}
        </Link>
      </PageHeader>
    </Container>
  );
}
