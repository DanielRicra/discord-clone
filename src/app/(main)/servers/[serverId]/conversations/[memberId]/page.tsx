import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversations";
import ChatHeader from "@/components/chat/chat-header";

interface MemberConversationPageProps {
	params: { memberId: string; serverId: string };
}

const MemberConversationPage: React.FC<MemberConversationPageProps> = async ({
	params,
}) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const currentMember = await prisma.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
		include: { profile: true },
	});

	if (!currentMember) {
		redirect("/");
	}

	const conversation = await getOrCreateConversation(
		currentMember.id,
		params.memberId,
	);

	if (!conversation) {
		redirect(`/servers/${params.serverId}`);
	}

	const { memberOne, memberTwo } = conversation;
	const otherMember =
		memberOne.profileId === profile.id ? memberTwo : memberOne;

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				imageUrl={otherMember.profile.imageUrl}
				name={otherMember.profile.name}
				serverId={params.serverId}
				type="conversation"
			/>
		</div>
	);
};

export default MemberConversationPage;
