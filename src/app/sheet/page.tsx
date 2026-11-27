import { permanentRedirect } from "next/navigation";

export default function SheetRedirectPage() {
  permanentRedirect("/price-bands");
}
