import React from "react";
import Image from "next/image";
import { Button } from "../components/ui/button";
import Container from "../components/Container";
import BgImage from "@/assets/images/carousel-bg-orange.webp";
import DefaultImg from "@/assets/images/default-img.png";


export default function AboutBrandSection() {

    return (
        <div className="py-15" style={{ backgroundImage: `url(${BgImage.src})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <Container className="flex flex-col md:flex-row items-center justify-center">
                <div className="max-w-[80%] flex items-center justify-between py-4 px-10 my-10 rounded-xl bg-white shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)]">

                    <div className="w-[60%] p-5">
                        <h2 className="text-2xl font-bold text-left text-[#3F3F46]">О бренде</h2>
                        <p className="text-md text-left my-5 leading-10">
                            Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque.Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque.
                        </p>
                        <Button
                            className="mt-5 text-md cursor-pointer bg-[#218A4F] hover:bg-[#365343]"
                            variant="default"
                            size="lg"
                        >
                            Подробнее
                        </Button>
                    </div>

                    <div className="w-[40%] h-100">
                        <Image
                            src={DefaultImg}
                            alt="About Brand"
                            width={0}
                            height={0}
                            className="w-[100%] h-100 object-cover rounded-xl"
                        />
                    </div>

                </div>
            </Container>
        </div>
    );
}