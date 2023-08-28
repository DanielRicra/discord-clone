import { currentProfile } from "@/lib/current-profile";

import { redirectToSignIn } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface InvitePageProps {
	params: { inviteCode: string };
}

const InvitePage: React.FC<InvitePageProps> = async ({ params }) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const existingServer = await prisma.server.findFirst({
		where: {
			inviteCode: params.inviteCode,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	if (existingServer) {
		redirect(`/servers/${existingServer.id}`);
	}

	const server = await prisma.server.update({
		where: {
			inviteCode: params.inviteCode,
		},
		data: {
			members: {
				create: [{ profileId: profile.id }],
			},
		},
	});

	if (server.id) {
		redirect(`/servers/${server.id}`);
	}

	return null;
};

export default InvitePage;
