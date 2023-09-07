"use client";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import {
	EditIcon,
	HashIcon,
	LockIcon,
	MicIcon,
	TrashIcon,
	VideoIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import ActionTooltip from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
	channel: Channel;
	server: Server;
	role?: MemberRole;
}

const IconMap = {
	[ChannelType.TEXT]: HashIcon,
	[ChannelType.AUDIO]: MicIcon,
	[ChannelType.VIDEO]: VideoIcon,
};

const ServerChannel: React.FC<ServerChannelProps> = ({
	channel,
	server,
	role,
}) => {
	const { onOpen } = useModal();
	const params = useParams();
	const router = useRouter();

	const Icon = IconMap[channel.type];

	const onCLick = () => {
		router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
	};

	const onAction = (e: React.MouseEvent, action: ModalType) => {
		e.stopPropagation();
		onOpen(action, { server, channel });
	};

	return (
		<div
			onClick={onCLick}
			className={cn(
				"group px-2 pl-3 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 cursor-pointer",
				params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
			)}
		>
			<Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
			<p
				className={cn(
					"line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
					params?.channelId === channel.id &&
						"text-primary dark:text-zinc-200 dark:group-hover:text-white",
				)}
			>
				{channel.name}
			</p>
			{channel.name !== "general" && role !== MemberRole.GUEST && (
				<div className="flex ml-auto items-center gap-x-2">
					<ActionTooltip label="Edit">
						<EditIcon
							onClick={(e) => onAction(e, "editChannel")}
							className="hidden group-hover:block w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>

					<ActionTooltip label="Edit">
						<TrashIcon
							onClick={(e) => onAction(e, "deleteChannel")}
							className="hidden group-hover:block w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
				</div>
			)}
			{channel.name === "general" && (
				<LockIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 ml-auto" />
			)}
		</div>
	);
};

export default ServerChannel;
