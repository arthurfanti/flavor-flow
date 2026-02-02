import { redirect } from "next/navigation";

export default function ProfilePage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/app/profile`);
}
