"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
	member: Member & { profile: Profile };
	server: Server;
}

const RoleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheckIcon className="ml-auto h-4 w-4 text-indigo-500" />
	),
	[MemberRole.ADMIN]: (
		<ShieldAlertIcon className="ml-auto h-4 w-4 text-rose-500" />
	),
};

const ServerMember: React.FC<ServerMemberProps> = ({ member, server }) => {
	const params = useParams();
	const router = useRouter();

	const icon = RoleIconMap[member.role];

	const onClick = () => {
		router.push(`/servers/${server.id}/conversations/${member.id}`);
	};

	return (
		<div
			onClick={onClick}
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 cursor-pointer",
				params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
			)}
		>
			<UserAvatar
				src={member.profile.imageUrl}
				className="h-6 w-6 md:h-8 md:w-8"
			/>
			<p
				className={cn(
					"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition truncate max-w-[130px]",
					params?.memberId === member.id &&
						"text-primary dar:text-zinc-200 dark:group-hover:text-white",
				)}
			>
				{member.profile.name}
			</p>
			{icon}
		</div>
	);
};

export default ServerMember;
