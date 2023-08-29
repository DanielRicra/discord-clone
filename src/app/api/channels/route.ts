import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
	req: Request,
	{ params }: { params: { memberId: string } },
) {
	try {
		const profile = await currentProfile();
		const { searchParams } = new URL(req.url);
		const { name, type } = await req.json();

		const serverId = searchParams.get("serverId");

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!serverId) {
			return new NextResponse("Bad request, serverId missing", { status: 400 });
		}

		if (name === "general") {
			return new NextResponse("Bad request, name cannot be 'general'", {
				status: 400,
			});
		}

		if (!name) {
			return new NextResponse("Bad request, name missing", { status: 400 });
		}

		const updatedServer = await prisma.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
					},
				},
			},
			data: {
				channels: {
					create: {
						profileId: profile.id,
						name,
						type,
					},
				},
			},
		});

		return NextResponse.json(updatedServer);
	} catch (error) {
		return new NextResponse("Internal server error", { status: 500 });
	}
}
