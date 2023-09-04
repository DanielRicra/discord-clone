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
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";
import { currentProfile } from "@/lib/current-profile";

interface ServerSidebarProps {
	serverId: string;
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
}) => {
	const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

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
		(member) => member.profileId !== profile.id,
	);

	if (!server) {
		return redirect("/");
	}

	const role = server.members.find(
		(member) => member.profileId === profile.id,
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

				<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

				{!!textChannels?.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channels"
							label="Text Channels"
							channelType={ChannelType.TEXT}
							role={role}
						/>
						{textChannels.map((channel) => (
							<ServerChannel
								key={channel.id}
								channel={channel}
								role={role}
								server={server}
							/>
						))}
					</div>
				)}
				{!!audioChannels?.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channels"
							label="Voice Channels"
							channelType={ChannelType.AUDIO}
							role={role}
						/>
						{audioChannels.map((channel) => (
							<ServerChannel
								key={channel.id}
								channel={channel}
								role={role}
								server={server}
							/>
						))}
					</div>
				)}
				{!!videoChannels?.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channels"
							label="Video Channels"
							channelType={ChannelType.VIDEO}
							role={role}
						/>
						{videoChannels.map((channel) => (
							<ServerChannel
								key={channel.id}
								channel={channel}
								role={role}
								server={server}
							/>
						))}
					</div>
				)}
				{!!members?.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="members"
							label="Members"
							role={role}
							server={server}
						/>
						{members.map((member) => (
							<ServerMember key={member.id} member={member} server={server} />
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

export default ServerSidebar;
