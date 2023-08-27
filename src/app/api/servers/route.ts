import { MemberRole } from "@prisma/client";
import crypto from "crypto";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
	try {
		const { name, imageUrl } = await req.json();
		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const newServer = await prisma.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: crypto.randomUUID(),
				channels: {
					create: [{ name: "general", profileId: profile.id }],
				},
				members: {
					create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
				},
			},
		});

		return NextResponse.json(newServer);
	} catch (error) {
		return new NextResponse("Internal server error", { status: 500 });
	}
}
