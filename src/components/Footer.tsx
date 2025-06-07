"use client";

import React from 'react'
import Container from "./Container";

const Footer = () => {
	return (
		<footer className="bg-[#2B2B2B] text-white p-4 mt-8">
			<Container>
				<p className="text-center">© 2023 My Blog. All rights reserved.</p>
				<div className="flex justify-center space-x-4 mt-2">
					<a href="#" className="hover:underline">Privacy Policy</a>
					<a href="#" className="hover:underline">Terms of Service</a>
				</div>
			</Container>
		</footer>
	)
}

export default Footer;