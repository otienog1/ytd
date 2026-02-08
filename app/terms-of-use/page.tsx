export default function TermsOfUse() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this YouTube Shorts Downloader service, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (videos) for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
          <p className="mt-2">Under this license you may not:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software contained on this service</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or mirror the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Copyright and Intellectual Property</h2>
          <p>
            This service respects the intellectual property rights of others. Users are solely responsible for ensuring they have the right to download and use any content.
            Downloading copyrighted material without permission may violate copyright laws in your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
          <p>You agree to use this service only for lawful purposes. You must:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Respect YouTube&apos;s Terms of Service</li>
            <li>Not violate any local, state, national, or international law</li>
            <li>Not infringe on the rights of others</li>
            <li>Not use this service to download content for redistribution or commercial use</li>
            <li>Not abuse or overload our service infrastructure</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Service Availability</h2>
          <p>
            We do not guarantee that our service will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the service, resulting in interruptions, delays, or errors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
          <p>
            The materials on this service are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Limitations</h2>
          <p>
            In no event shall YouTube Shorts Downloader or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Rate Limiting</h2>
          <p>
            To ensure fair use and maintain service quality, we implement rate limiting. Excessive use may result in temporary or permanent suspension of access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right to revise these terms of service at any time without notice. By using this service you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us through our website.
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
