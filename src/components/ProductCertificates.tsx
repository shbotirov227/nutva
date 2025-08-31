"use client";

import Image from "next/image";
import CertificateImg1 from "@/assets/images/certificate-img1.png";
import CertificateImg2 from "@/assets/images/certificate_1748945174-1.png";
import CertificateImg3 from "@/assets/images/certificate_1748945174-2.png";
import CertificateImg4 from "@/assets/images/certificate_1748945174-3.png";
import CertificateImg5 from "@/assets/images/certificate_1748945174-4.png";
import CertificateImg6 from "@/assets/images/certificate_1748945174-5.png";

const IMAGES = [
  CertificateImg1,
  CertificateImg2,
  CertificateImg3,
  CertificateImg4,
  CertificateImg5,
  CertificateImg6,
];

export default function ProductCertificates() {
  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-12">
        {IMAGES.map((item, idx) => (
          <div key={`certificate-${idx}`} className="flex justify-center">
            <Image
              src={item.src}
              alt={`Certificate ${idx + 1}`}
              width={250}
              height={350}
              className="w-full max-w-[250px] h-auto object-contain rounded-xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
