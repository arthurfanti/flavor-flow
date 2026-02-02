import { redirect } from "next/navigation";

export default function RecipeDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  redirect(`/${params.locale}/app/recipes/${params.id}`);
}
