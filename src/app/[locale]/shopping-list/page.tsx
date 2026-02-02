import { redirect } from "next/navigation";

export default function ShoppingListPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/app/shopping-list`);
}
