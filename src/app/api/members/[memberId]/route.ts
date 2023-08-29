import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";

export async function PATCH(
	req: Request,
	{ params }: { params: { memberId: string } },
) {
	try {
		const profile = await currentProfile();
		const { searchParams } = new URL(req.url);
		const { role } = await req.json();

		const serverId = searchParams.get("serverId");

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!serverId) {
			return new NextResponse("Bad request, serverId missing", { status: 400 });
		}

		const updatedServer = await prisma.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					update: {
						where: {
							id: params.memberId,
							profileId: {
								not: profile.id,
							},
						},
						data: {
							role,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: "asc",
					},
				},
			},
		});

		return NextResponse.json(updatedServer);
	} catch (error) {
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function DELETE(
	eq: Request,
	{ params }: { params: { memberId: string } },
) {
	try {
		const profile = await currentProfile();
		const { searchParams } = new URL(eq.url);
		const serverId = searchParams.get("serverId");

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!serverId) {
			return new NextResponse("Bad request, serverId missing", { status: 400 });
		}

		const server = await prisma.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					deleteMany: {
						id: params.memberId,
						profileId: { not: profile.id },
					},
				},
			},
			include: {
				members: {
					include: { profile: true },
					orderBy: { role: "asc" },
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		return new NextResponse("Internal server error", { status: 500 });
	}
}
