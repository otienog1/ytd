export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our YouTube Shorts Downloader service.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Information You Provide</h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>YouTube video URLs that you submit for download</li>
            <li>Technical information such as IP address, browser type, and device information</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Automatically Collected Information</h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Usage data and analytics (pages visited, time spent on site)</li>
            <li>Error logs and diagnostic information</li>
            <li>Session information for rate limiting purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Process your video download requests</li>
            <li>Improve and optimize our service</li>
            <li>Prevent abuse and enforce rate limiting</li>
            <li>Analyze usage patterns and trends</li>
            <li>Maintain service security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Retention</h2>
          <p>
            Downloaded videos are temporarily stored on our servers for processing. All files are automatically deleted within 24 hours of processing.
            We do not permanently store the videos you download.
          </p>
          <p className="mt-2">
            Session data and download history may be retained for up to 30 days for operational purposes and service improvement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
          <p>
            Our service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
          <p className="mt-2">Third-party services we use:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Google Cloud Platform (for file storage and hosting)</li>
            <li>MongoDB Atlas (for database services)</li>
            <li>Redis Cloud (for caching and session management)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your data</li>
            <li>Objection to processing</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our website.
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
