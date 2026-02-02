import { redirect } from "next/navigation";

export default function PantryPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/app/pantry`);
}
