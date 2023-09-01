"use client";

import { PlusIcon, SettingsIcon } from "lucide-react";
import { ChannelType, MemberRole } from "@prisma/client";

import { ServerWithMembersWithProfiles } from "@/types";
import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

type ServerSectionProps = {
	label: string;
	server?: ServerWithMembersWithProfiles;
	role?: MemberRole;
	channelType?: ChannelType;
	sectionType: "channels" | "members";
};

const ServerSection: React.FC<ServerSectionProps> = ({
	label,
	sectionType,
	channelType,
	role,
	server,
}) => {
	const { onOpen } = useModal();
	return (
		<div className="flex items-center justify-between py-2">
			<p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
				{label}
			</p>

			{role !== MemberRole.GUEST && sectionType === "channels" && (
				<ActionTooltip label="create channel" side="top">
					<button
						type="button"
						onClick={() => onOpen("createChannel", { channelType })}
						className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
					>
						<PlusIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
					</button>
				</ActionTooltip>
			)}
			{role === MemberRole.ADMIN && sectionType === "members" && (
				<ActionTooltip label="Manage Members" side="top">
					<button
						type="button"
						onClick={() => onOpen("members", { server })}
						className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
					>
						<SettingsIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
					</button>
				</ActionTooltip>
			)}
		</div>
	);
};

export default ServerSection;
