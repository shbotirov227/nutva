
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function TestPage() {
    const session = await getServerSession(authOptions);

    console.log(session?.user?.token);

    return (
        <div>
            <h1>Test Session</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    );
}
