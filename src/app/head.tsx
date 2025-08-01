export default function Head() {
  return (
    <>
      <meta name="author" content="Nutva Pharm" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/favicon.ico" />
 

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Nutva Pharm",
            url: "https://nutva.uz",
            logo: "https://nutva.uz/logo.png",
            sameAs: [
              // ✅ Instagram
              "https://www.instagram.com/nutva_extra/",
              "https://www.instagram.com/gelmin_kids/",
              "https://www.instagram.com/viris.men/",
              "https://www.instagram.com/nutva_fertilia/",
              "https://www.instagram.com/nutva.uz/",

              // ✅ Telegram
              "https://t.me/nutvacomplex_extra",
              "https://t.me/nutva_gelminkids",
              "https://t.me/nutva_virismen",
              "https://t.me/nutva_fertiliawomen",
              "https://t.me/Nutva_Complex",
              "https://t.me/nutvauz",

              // ✅ Facebook
              "https://www.facebook.com/profile.php?id=61576285561357",
              "https://www.facebook.com/profile.php?id=61576231412052",
              "https://www.facebook.com/profile.php?id=61576134155901",
              "https://www.facebook.com/profile.php?id=61576354677800",
              "https://www.facebook.com/NUTVAC0MPLEX",

              // ✅ YouTube
              "https://www.youtube.com/@NutvaUz?sub_confirmation=1"
            ],
          }),
        }}
      />
    </>
  );
}
