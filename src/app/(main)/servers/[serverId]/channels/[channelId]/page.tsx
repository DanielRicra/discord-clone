import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";

interface ChannelPageProps {
	params: { serverId: string; channelId: string };
}

const ChannelPage: React.FC<ChannelPageProps> = async ({ params }) => {
	const profile = await currentProfile();
	if (!profile) {
		return redirectToSignIn();
	}

	const channel = await prisma.channel.findUnique({
		where: { id: params.channelId },
	});

	const member = await prisma.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
	});

	if (!channel || !member) return redirect("/");

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				name={channel.name}
				serverId={channel.serverId}
				type="channel"
			/>
			<ChatMessages
				apiUrl="/api/messages"
				chatId={channel.id}
				member={member}
				name={channel.name}
				paramKey="channelId"
				paramValue={channel.id}
				socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
				socketUrl="/api/socket/messages"
				type="channel"
			/>
			<ChatInput
				apiUrl="/api/socket/messages"
				name={channel.name}
				query={{ channelId: channel.id, serverId: channel.serverId }}
				type="channel"
			/>
		</div>
	);
};

export default ChannelPage;
