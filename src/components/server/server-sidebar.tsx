import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import {
	HashIcon,
	MicIcon,
	ShieldAlertIcon,
	ShieldCheckIcon,
	VideoIcon,
} from "lucide-react";

interface ServerSidebarProps {
	serverId: string;
	profileId: string;
}

const IconMap = {
	[ChannelType.TEXT]: <HashIcon className="mr-2 h-4 w-4" />,
	[ChannelType.AUDIO]: <MicIcon className="mr-2 h-4 w-4" />,
	[ChannelType.VIDEO]: <VideoIcon className="mr-2 h-4 w-4" />,
};

const RoleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheckIcon className="mr-2 h-4 w-4 text-indigo-500" />
	),
	[MemberRole.ADMIN]: (
		<ShieldAlertIcon className="mr-2 h-4 w-4 text-rose-500" />
	),
};

const ServerSidebar: React.FC<ServerSidebarProps> = async ({
	serverId,
	profileId,
}) => {
	const server = await prisma.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: { orderBy: { createdAt: "asc" } },
			members: { include: { profile: true }, orderBy: { role: "asc" } },
		},
	});

	const textChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.TEXT,
	);
	const audioChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.AUDIO,
	);
	const videoChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.VIDEO,
	);
	const members = server?.members.filter(
		(member) => member.profileId !== profileId,
	);

	if (!server) {
		return redirect("/");
	}

	const role = server.members.find(
		(member) => member.profileId === profileId,
	)?.role;

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
			<ServerHeader server={server} role={role} />
			<ScrollArea className="flex-1 px-3">
				<div className="mt-2">
					<ServerSearch
						data={[
							{
								label: "Text Channels",
								type: "channel",
								data: textChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: IconMap[channel.type],
								})),
							},
							{
								label: "Voice Channels",
								type: "channel",
								data: audioChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: IconMap[channel.type],
								})),
							},
							{
								label: "Video Channels",
								type: "channel",
								data: videoChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: IconMap[channel.type],
								})),
							},
							{
								label: "Members",
								type: "member",
								data: members?.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: RoleIconMap[member.role],
								})),
							},
						]}
					/>
				</div>
			</ScrollArea>
		</div>
	);
};

export default ServerSidebar;
