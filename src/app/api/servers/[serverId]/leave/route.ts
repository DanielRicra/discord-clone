import { NextResponse } from "next/server";
import crypto from "crypto";

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";

export async function PATCH(
	req: Request,
	{ params }: { params: { serverId: string } },
) {
	try {
		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		await prisma.server.update({
			where: {
				id: params.serverId,
				profileId: {
					not: profile.id,
				},
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			data: {
				members: {
					deleteMany: {
						profileId: profile.id,
					},
				},
			},
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		return new NextResponse("Internal server error", { status: 500 });
	}
}
