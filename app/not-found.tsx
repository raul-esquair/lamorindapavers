import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <span className="text-8xl md:text-9xl font-serif font-bold text-brand-blue/20">
          404
        </span>
        <h1 className="text-3xl md:text-4xl text-warm-gray-900 -mt-4 mb-4">
          Page Not Found
        </h1>
        <p className="text-warm-gray-500 font-sans mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
          <Button href="/contact" variant="outline">
            Get a Free Estimate
          </Button>
        </div>
      </div>
    </section>
  );
}
