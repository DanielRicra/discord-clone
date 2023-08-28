"use client"

import { MemberRole } from "@prisma/client";
import {
	ChevronDown,
	LogOutIcon,
	PlusCircleIcon,
	SettingsIcon,
	TrashIcon,
	UserPlusIcon,
	UsersIcon,
} from "lucide-react";

import { ServerWithMembersWithProfiles } from "@/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles;
	role?: MemberRole;
}

const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
	const { onOpen } = useModal();
	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = isAdmin || role === MemberRole.MODERATOR;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button
					className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
					type="button"
				>
					{server.name}
					<ChevronDown className="h-5 w-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
				{isModerator && (
					<DropdownMenuItem
						onClick={() => onOpen("invite", { server })}
						className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
					>
						Invite People
						<UserPlusIcon className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}

				{isAdmin && (
					<>
						<DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
							Server Settings
							<SettingsIcon className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>

						<DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
							Manage members
							<UsersIcon className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>
					</>
				)}

				{isModerator && (
					<>
						<DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
							Create Channel
							<PlusCircleIcon className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>

						<Separator />
					</>
				)}

				{isAdmin && (
					<DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
						Delete Server
						<TrashIcon className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}

				{!isAdmin && (
					<DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
						Leave Server
						<LogOutIcon className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ServerHeader;
