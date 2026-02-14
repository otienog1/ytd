export function StructuredData() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'YouTube Shorts Downloader',
    url: 'https://ytshortsdownload.vercel.app',
    description: 'Free online YouTube Shorts downloader',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ytshortsdownload.vercel.app/?url={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'YouTube Shorts Downloader',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    operatingSystem: 'Web Browser',
    description: 'Free online YouTube Shorts downloader. Download Shorts videos in HD quality without watermark.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1'
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is it free to download YouTube Shorts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our YouTube Shorts downloader is completely free. No registration or payment required.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I download YouTube Shorts without watermark?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our tool downloads YouTube Shorts videos without watermarks in their original quality.'
        }
      },
      {
        '@type': 'Question',
        name: 'What video quality can I download?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can download YouTube Shorts in various qualities including 1080p, 720p, and 480p depending on the original video quality.'
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
