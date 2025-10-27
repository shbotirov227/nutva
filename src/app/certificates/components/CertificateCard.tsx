"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image, { type StaticImageData } from "next/image";
import {
  // Building, Eye,
  Download, Award, Shield,
  LucideSquareArrowOutUpRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import * as pdfjsLib from "pdfjs-dist/webpack.mjs";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

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
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  // const canvasRef = useRef<HTMLCanvasElement>(null);

  const imageSrc = typeof certificate.image === "string" ? certificate.image : certificate.image.src;
  const isPdf = imageSrc.toLowerCase().endsWith(".pdf");
  const itemKey = String(certificate.id);

  const displayTitle = t(`certificates.items.${itemKey}.title`, { defaultValue: certificate.title });
  // const displayDesc = t(`certificates.items.${itemKey}.description`, { defaultValue: certificate.description });
  // const displayIssuer = t(`certificates.items.${itemKey}.issuer`, { defaultValue: certificate.issuer });

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

  // Load PDF preview
  useEffect(() => {
    if (!isPdf) return;

    const loadPdfPreview = async () => {
      setPdfLoading(true);
      try {
        const loadingTask = pdfjsLib.getDocument(imageSrc);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Set scale for good quality preview
        const viewport = page.getViewport({ scale: 2 });

        // Create canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          // Convert canvas to image URL
          const imageDataUrl = canvas.toDataURL("image/png", 0.95);
          setPdfPreviewUrl(imageDataUrl);
          setIsImageLoaded(true);
        }

        // Cleanup
        await pdf.destroy();
      } catch (error) {
        console.error("Error loading PDF preview:", error);
        setIsImageLoaded(true);
      } finally {
        setPdfLoading(false);
      }
    };

    loadPdfPreview();
  }, [isPdf, imageSrc]);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-2 border-emerald-100 hover:border-emerald-200 rounded-2xl overflow-hidden relative">
      {/* Decorative gradient top bar */}
      {/* <div className="h-2 bg-gradient-to-r from-[#51FFAE] to-[#6DB19E]"></div> */}

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
          <div
            onClick={() => {
              if (isPdf) {
                window.open(imageSrc, "_blank", "noopener,noreferrer");
              }
            }}
            className="relative bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl p-6 border-2 border-dashed border-emerald-200 group-hover:border-emerald-300 transition-all duration-300 group-hover:shadow-inner cursor-pointer">
            <div className="aspect-[4/3] relative overflow-hidden rounded-xl">
              {isPdf ? (
                <>
                  {pdfPreviewUrl ? (
                    <Image
                      src={pdfPreviewUrl}
                      alt={displayTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      priority={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-600">
                      <div className={`w-16 h-16 rounded-xl bg-white border-2 border-emerald-200 flex items-center justify-center shadow ${pdfLoading ? 'animate-pulse' : ''}`}>
                        <Award className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="text-sm">
                        {pdfLoading
                          ? t("certificates.loading", { defaultValue: "Yuklanmoqda..." })
                          : t("certificates.pdfDoc")}
                      </div>
                    </div>
                  )}
                </>
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
                  {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center rounded-xl">
                      <Award className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-4">
                <div
                  onClick={() => {
                    if (isPdf) {
                      window.open(imageSrc, "_blank", "noopener, noreferrer");
                    }
                  }}
                  className="text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm cursor-pointer flex items-center">
                  {t("certificates.clickToZoom")}
                  <LucideSquareArrowOutUpRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Info with better styling */}
          {/* <div className="space-y-3">
            <p className="text-slate-600 leading-relaxed">{displayDesc}</p>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-full">
                <Building className="w-4 h-4 text-slate-600" />
                <span>{displayIssuer}</span>
              </div>
            </div>
          </div> */}

          {/* Enhanced Actions */}
          {/* <div className="flex gap-3 pt-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (isPdf) {
                  setPdfModalOpen(true);
                } else {
                  setOpen(true);
                }
              }}
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
              onClick={(e) => e.stopPropagation()}
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
          </div> */}

          {/* Lightweight Modal - Only for non-PDF files */}
          {open && !isPdf && (
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
                <div className="p-4 overflow-auto">
                  <Image
                    src={imageSrc}
                    alt={displayTitle}
                    width={1600}
                    height={1200}
                    className="w-full h-auto rounded-lg object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PDF Modal with iframe */}
          {pdfModalOpen && isPdf && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setPdfModalOpen(false)}
              />
              <div className="relative z-10 w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-emerald-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#51FFAE] to-[#6DB19E] flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-900">{displayTitle}</h3>
                      <p className="text-sm text-emerald-600">{catLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={imageSrc}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t("certificates.download")}
                      </Button>
                    </a>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPdfModalOpen(false)}
                      className="cursor-pointer border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      {t("certificates.close")}
                    </Button>
                  </div>
                </div>

                {/* PDF Content */}
                <div className="h-[calc(100%-5rem)] bg-slate-50">
                  <iframe
                    src={imageSrc}
                    className="w-full h-full"
                    title={displayTitle}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}