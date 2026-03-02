import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-4">
      <Card className="max-w-md text-center">
        <p className="text-4xl font-bold text-gray-300">404</p>
        <p className="mt-2 text-lg font-medium text-gray-900">Page not found</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="secondary">Go home</Button>
        </Link>
      </Card>
    </main>
  );
}
