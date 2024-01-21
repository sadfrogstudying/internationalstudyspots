import { Link } from "@/components/ui/link";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find user</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
