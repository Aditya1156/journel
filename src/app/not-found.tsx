import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-white/80">
            Page not found
          </h2>
          <p className="text-white/60">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-6">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
