import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
	req: Request,
	{ params }: { params: { channelId: string } },
) {
	try {
		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get("serverId");

		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!serverId) {
			return new NextResponse("Bad request", { status: 400 });
		}

		await prisma.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					delete: {
						id: params.channelId,
						name: {
							not: "general",
						},
					},
				},
			},
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { channelId: string } },
) {
	try {
		const { searchParams } = new URL(req.url);
		const { name, type } = await req.json();
		const serverId = searchParams.get("serverId");

		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!serverId) {
			return new NextResponse("Bad request", { status: 400 });
		}

		if (name === "general") {
			return new NextResponse("Name cannot be general", { status: 400 });
		}

		const updatedServer = await prisma.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					update: {
						where: {
							id: params.channelId,
							NOT: {
								name: "general",
							},
						},
						data: {
							name,
							type,
						},
					},
				},
			},
		});

		return NextResponse.json(updatedServer);
	} catch (error) {
		return new NextResponse("Internal server error", { status: 500 });
	}
}
