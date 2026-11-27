import { permanentRedirect } from "next/navigation";

export default function TableRedirectPage() {
  permanentRedirect("/guide");
}
