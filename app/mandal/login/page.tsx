import { redirect } from "next/navigation";

export default function MandalLoginRedirect() {
  redirect("/admin/login");
}
