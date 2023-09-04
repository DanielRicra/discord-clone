import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerPageProps {
	params: { serverId: string };
}

const ServerPage: React.FC<ServerPageProps> = async ({ params }) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const server = await prisma.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: "general",
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	const initialChannel = server?.channels[0];

	if (initialChannel?.name !== "general") {
		return <h1>Something went wrong. Send us an email, or try again later.</h1>;
	}

	return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
};

export default ServerPage;
