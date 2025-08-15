import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image, { type StaticImageData } from "next/image";
import { Building, Eye, Download, Award, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface Certificate {
  id: number;
  title: string;
  description: string;
  image: string | StaticImageData;
  category: string;
  issuer: string;
}

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const { t } = useTranslation();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const imageSrc = typeof certificate.image === "string" ? certificate.image : certificate.image.src;
  const isPdf = imageSrc.toLowerCase().endsWith(".pdf");
  const itemKey = String(certificate.id);
  const displayTitle = t(`certificates.items.${itemKey}.title`, { defaultValue: certificate.title });
  const displayDesc = t(`certificates.items.${itemKey}.description`, { defaultValue: certificate.description });
  const displayIssuer = t(`certificates.items.${itemKey}.issuer`, { defaultValue: certificate.issuer });
  const catLabel = (() => {
    switch (certificate.category) {
      case "Документация":
        return t("certificates.categories.documentation");
      case "Разрешение":
        return t("certificates.categories.permission");
      case "Безопасность":
        return t("certificates.categories.safety");
      case "Halal":
        return t("certificates.categories.halal");
      default:
        return certificate.category;
    }
  })();

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-2 border-emerald-100 hover:border-emerald-200 rounded-2xl overflow-hidden relative">
      {/* Decorative gradient top bar */}
      <div className="h-2 bg-gradient-to-r from-[#51FFAE] to-[#6DB19E]"></div>

      <CardHeader className="pb-4 relative">
        {/* Floating gradient accent */}
        <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-[#51FFAE]/20 to-[#6DB19E]/20 rounded-full blur-xl"></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <Badge variant="outline" className="bg-gradient-to-r from-[#51FFAE] to-[#6DB19E] text-white border-0 shadow-md">
            {catLabel}
          </Badge>

        </div>

        <CardTitle className="leading-tight group-hover:text-emerald-700 transition-colors duration-300 flex items-start gap-2">
          <Shield className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
          {displayTitle}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          {/* Certificate Preview with enhanced styling */}
          <div className="relative bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl p-6 border-2 border-dashed border-emerald-200 group-hover:border-emerald-300 transition-all duration-300 group-hover:shadow-inner">
            <div className="aspect-[4/3] relative overflow-hidden rounded-xl">
              {isPdf ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-600">
                  <div className="w-16 h-16 rounded-xl bg-white border-2 border-emerald-200 flex items-center justify-center shadow">
                    <Award className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-sm">{t("certificates.pdfDoc")}</div>
                </div>
              ) : (
                <>
                  <Image
                    src={imageSrc}
                    alt={displayTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    onLoad={() => setIsImageLoaded(true)}
                    priority={false}
                  />
                    {/* <iframe
                      src={imageSrc}
                      title={displayTitle}
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      onLoad={() => setIsImageLoaded(true)}
                      width="100%"
                      height="100%"
                    /> */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center rounded-xl">
                      <Award className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-4">
                <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm cursor-pointer">
                  {t("certificates.clickToZoom")}
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Info with better styling */}
          <div className="space-y-3">
            <p className="text-slate-600 leading-relaxed">{displayDesc}</p>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-full">
                <Building className="w-4 h-4 text-slate-600" />
                <span>{displayIssuer}</span>
              </div>

            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1 bg-gradient-to-r from-[#51FFAE] to-[#6DB19E] text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t("certificates.view")}
            </Button>

            <a
              href={imageSrc}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                {t("certificates.download")}
              </Button>
            </a>
          </div>

          {/* Lightweight Modal */}
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <div className="relative z-10 max-w-5xl w-full max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden border">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    {displayTitle}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="cursor-pointer"
                  >
                    {t("certificates.close")}
                  </Button>

                </div>
                {isPdf ? (
                  <div className="p-0">
                    <object data={imageSrc} type="application/pdf" className="w-full h-[80vh]" aria-label={displayTitle}>
                      <div className="p-6 text-center text-sm text-slate-600">
                        {t("certificates.pdfFallback")}
                        <Link href={imageSrc} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">
                          {t("certificates.openInNewTab")}
                        </Link>
                        .
                      </div>
                    </object>
                  </div>
                ) : (
                  <div className="p-4 overflow-auto">
                    <Image
                      src={imageSrc}
                      alt={displayTitle}
                      width={1600}
                      height={1200}
                      className="w-full h-auto rounded-lg object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
