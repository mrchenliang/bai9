import { permanentRedirect } from "next/navigation";

export default function MapsRedirectPage() {
  permanentRedirect("/map");
}
