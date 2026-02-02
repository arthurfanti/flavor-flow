import { redirect } from "next/navigation";

export default function RecipesPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/app/recipes`);
}
