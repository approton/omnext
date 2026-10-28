import SearchInterface from "../../components/search/search-interface";
export const metadata = {
  title: "Search Omnext",
  description: "Search Omnext capabilities, solutions and insights.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Search | Omnext Technologies",
    description: "Search Omnext capabilities, solutions and insights.",
  },
};
export default function SearchPage() {
  return (
    <main id="main-content">
      <SearchInterface />
    </main>
  );
}
