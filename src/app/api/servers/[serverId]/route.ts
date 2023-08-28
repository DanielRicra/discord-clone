import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";

export async function PATCH(
	req: Request,
	{ params }: { params: { serverId: string } },
) {
	try {
		const profile = await currentProfile();
		const { name, imageUrl } = await req.json();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!params.serverId) {
			return new NextResponse("Bad request, Id missing", { status: 400 });
		}

		const updatedServer = await prisma.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: {
				name,
				imageUrl,
			},
		});

		return NextResponse.json(updatedServer);
	} catch (error) {
		return new NextResponse("Internal server error", { status: 500 });
	}
}
