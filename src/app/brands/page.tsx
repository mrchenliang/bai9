import { permanentRedirect } from "next/navigation";

export default function BrandsRedirectPage() {
  permanentRedirect("/houses");
}
