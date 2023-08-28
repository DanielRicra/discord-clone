import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import InitialModal from "@/components/modals/initial-modal";

interface SetupPageProps {}

const SetupPage: React.FC<SetupPageProps> = async () => {
	const profile = await initialProfile();

	const server = await prisma.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	if (server) {
		return redirect(`/servers/${server.id}`);
	}

	return <InitialModal />;
};

export default SetupPage;