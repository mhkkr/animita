import type { Metadata } from "next";
import { Suspense } from "react";

import LayoutContainer from "~/components/layouts/Container";
import AnimeSearch from "~/components/animes/AnimeSearch";
import { RingSpinner } from "~/components/spinners/Spinner";

export const metadata: Metadata = {
  title: "検索",
};

export default function SearchPage() {
  return (
    <LayoutContainer>
      <Suspense fallback={<div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>}>
        <AnimeSearch />
      </Suspense>
    </LayoutContainer>
  );
}
