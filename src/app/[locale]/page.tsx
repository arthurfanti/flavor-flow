import LandingPage from "@/components/landing/LandingPage";

export default async function Home(props: { params: Promise<{ locale: string }> }) {
  await props.params;
  return <LandingPage />;
}
