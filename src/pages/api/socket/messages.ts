import { NextApiRequest } from "next";

import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIO } from "@/types";
import { prisma } from "@/lib/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIO,
) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const profile = await currentProfilePages(req);
		const { content, fileUrl } = req.body;
		const { serverId, channelId } = req.query;

		if (!profile) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		if (!serverId || !channelId) {
			return res
				.status(400)
				.json({ message: "Server id or channel id missing" });
		}

		if (!content) {
			return res.status(400).json({ message: "Content is required" });
		}

		const server = await prisma.server.findFirst({
			where: {
				id: serverId as string,
				members: { some: { profileId: profile.id } },
			},
			include: {
				members: true,
			},
		});

		if (!server) {
			return res.status(404).json({ message: "Server not found" });
		}

		const channel = await prisma.channel.findFirstOrThrow({
			where: { id: channelId as string, serverId: serverId as string },
		});

		if (!channel) {
			return res.status(404).json({ message: "Channel not found" });
		}

		const member = server.members.find(
			(member) => member.profileId === profile.id,
		);

		if (!member) {
			return res.status(404).json({ message: "Member not found" });
		}

		const message = await prisma.message.create({
			data: { content, fileUrl, channelId: channel.id, memberId: member.id },
			include: {
				member: {
					include: { profile: true },
				},
			},
		});

		const channelKey = `chat:${channelId}:messages`;

		res.socket.server.io.emit(channelKey, message);

		return res.status(200).json(message);
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}
