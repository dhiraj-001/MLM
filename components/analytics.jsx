"use client"

import { useEffect, Suspense } from "react"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"

// This component handles the search params and page tracking
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && window.gtag) {
      // Page view tracking
      window.gtag("config", "G-MEASUREMENT-ID", {
        page_path: pathname,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function AnalyticsG() {
  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT-ID`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MEASUREMENT-ID', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        id="trustpilot-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
            a=d.createElement(s);a.async=1;a.src=r;a.type='text/javascript';
            var f=function(){var p=d.getElementsByTagName(s)[0];p.parentNode.insertBefore(a,p)};
            if(w.opera=='[object Opera]'){d.addEventListener('DOMContentLoaded',f,false)}else{f()}
            })(window,document,'script','//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js','tp');
            tp('register', 'TRUSTPILOT-WIDGET-ID');
          `,
        }}
      />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
