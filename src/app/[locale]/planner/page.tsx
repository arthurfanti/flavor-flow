import { redirect } from "next/navigation";

export default function PlannerPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/app/planner`);
}
