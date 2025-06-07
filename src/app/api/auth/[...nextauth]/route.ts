import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import type { Session, User } from "next-auth"

// User tipini kengaytirish

interface ExtendedUser extends User {
	token?: string;
	refreshToken?: string;
	role?: string;
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					console.error("Missing credentials")
					return null
				}

				try {
					console.log("Attempting login with:", { email: credentials.email })

					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Accept": "application/json",
							"Access-Control-Allow-Origin": "*",
						},
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
						}),
					})

					console.log("API Response status:", res.status)
					console.log("API Response headers:", Object.fromEntries(res.headers.entries()))

					// Check if response is ok
					if (!res.ok) {
						const errorText = await res.text()
						console.error("API Error Response:", errorText)
						return null
					}

					// Check if response is JSON
					const contentType = res.headers.get("content-type")
					if (!contentType || !contentType.includes("application/json")) {
						const responseText = await res.text()
						console.error("Non-JSON response:", responseText)
						return null
					}

					const user = await res.json()
					console.log("Login successful, user data:", user)

					// To'g'ri tekshirish va qiymatlarni berish
					if (user && (user.token || user.accessToken)) {
						return {
							id: user.id || user.email,
							email: user.email,
							name: user.name,
							// Har doim tokenni accessToken sifatida ishlatamiz
							token: user.token ?? user.accessToken,
							refreshToken: user.refreshToken,
							role: user.role,
						} as ExtendedUser
					}

					console.error("Invalid user data structure:", user)
					return null

				} catch (error) {
					console.error("Network or parsing error:", error)
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60, // 24 soat
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	callbacks: {
		async jwt({ token, user }: { token: JWT; user?: ExtendedUser }) {
			console.log("JWT callback", token, user);
			if (user) {
				token.accessToken = user.token // Bu endi har doim bo'ladi
				token.refreshToken = user.refreshToken
				token.role = user.role
				token.id = user.id
			}
			return token
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			console.log("SESSION callback", session, token);
			// Sessionga token ma'lumotlarini qo'shish
			return {
				...session,
				// accessToken: token.accessToken,
				// refreshToken: token.refreshToken,
				// role: token.role,
				// user: {
				// 	...session.user,
				// 	id: token.id,	
				// },
				user: {
					...session.user,
					id: token.id,
					token: token.accessToken,
					refreshToken: token.refreshToken,
					role: token.role,
				},
			}
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
