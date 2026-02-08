export default function FAQ() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">What is YouTube Shorts Downloader?</h2>
          <p className="text-muted-foreground">
            YouTube Shorts Downloader is a free online tool that allows you to download YouTube Shorts videos in MP4 format with the highest available quality. No software installation or registration is required.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How do I download a YouTube Shorts video?</h2>
          <p className="text-muted-foreground">
            Simply copy the URL of the YouTube Shorts video you want to download, paste it into the input field on our homepage, and click the &quot;Download Video&quot; button. Wait for the processing to complete, then click the &quot;Download MP4&quot; button to save the video to your device.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Is this service free?</h2>
          <p className="text-muted-foreground">
            Yes, our YouTube Shorts Downloader is completely free to use. There are no hidden fees or premium subscriptions required.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What video quality can I download?</h2>
          <p className="text-muted-foreground">
            Our service automatically downloads the highest quality available for the YouTube Shorts video, typically up to 1080p or the maximum resolution uploaded by the creator.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Do I need to create an account?</h2>
          <p className="text-muted-foreground">
            No, you don&apos;t need to create an account or sign up. Our service is designed for quick and easy downloads without any registration requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Is it legal to download YouTube Shorts videos?</h2>
          <p className="text-muted-foreground">
            Downloading videos from YouTube may violate their Terms of Service. This tool is intended for personal use only, such as downloading your own content or content for which you have permission. Users are responsible for ensuring they have the right to download and use any content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How long are downloaded files stored on your servers?</h2>
          <p className="text-muted-foreground">
            Downloaded videos are temporarily stored for processing only and are automatically deleted within 24 hours. We do not permanently store any videos you download.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Can I download videos on mobile devices?</h2>
          <p className="text-muted-foreground">
            Yes, our service is fully responsive and works on all devices including smartphones, tablets, and desktop computers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Why is my download taking so long?</h2>
          <p className="text-muted-foreground">
            Download time depends on the video length, quality, and current server load. Most videos are processed within 30 seconds to 2 minutes. If processing takes longer than expected, please try again later.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What should I do if a download fails?</h2>
          <p className="text-muted-foreground">
            If a download fails, please check that:
          </p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-muted-foreground">
            <li>The URL is a valid YouTube Shorts link</li>
            <li>The video is publicly available and not private or age-restricted</li>
            <li>You have a stable internet connection</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            If the problem persists, try again later or contact us for assistance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Is there a download limit?</h2>
          <p className="text-muted-foreground">
            To prevent abuse and ensure service quality for all users, we implement rate limiting. Individual users may experience temporary restrictions if they exceed reasonable usage limits.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Can I download regular YouTube videos (not Shorts)?</h2>
          <p className="text-muted-foreground">
            Currently, our service is specifically designed for YouTube Shorts videos. Support for regular YouTube videos may be added in the future.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Do you collect my personal information?</h2>
          <p className="text-muted-foreground">
            We collect minimal information necessary to provide the service, such as the video URLs you submit and basic analytics. We do not sell or share your personal information with third parties. Please see our Privacy Policy for more details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How can I contact support?</h2>
          <p className="text-muted-foreground">
            If you have questions, issues, or feedback, please contact us through the contact information provided on our website.
          </p>
        </section>
      </div>
    </main>
  );
}
