"use client";

import clsx from "clsx";
import React from "react";

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={clsx("container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20", className)}>
            {children}
        </div>
    );
};

export default Container;
