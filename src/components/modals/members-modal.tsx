"use client";

import { useState } from "react";
import {
	CheckIcon,
	GavelIcon,
	LoaderIcon,
	MoreVerticalIcon,
	ShieldAlertIcon,
	ShieldCheckIcon,
	ShieldIcon,
	ShieldQuestionIcon,
} from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldCheckIcon className="H-4 w-4 ml-2 text-indigo-500" />,
	ADMIN: <ShieldAlertIcon className="H-4 w-4 ml-2 text-rose-500" />,
};

const MembersModal = () => {
	const { isOpen, onClose, type, data, onOpen } = useModal();
	const [loadingId, setLoadingId] = useState("");
	const router = useRouter();

	const { server } = data as { server: ServerWithMembersWithProfiles };
	const isModalOpen = isOpen && type === "members";

	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId);

			const url = `/api/members/${memberId}?serverId=${server.id}`;
			const response = await axios.delete(url);

			router.refresh();
			onOpen("members", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	};

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId);

			const url = `/api/members/${memberId}?serverId=${server.id}`;

			const response = await axios.patch(url, { role });

			router.refresh();
			onOpen("members", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-white overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Customize your server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-200">
						{server?.members?.length} Members
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{server?.members?.map((member) => (
						<div key={member.id} className="flex items-center gap-x-2 mb-6">
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-xs font-semibold flex items-center gap-x-1">
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500 dark:text-zinc-300">
									{member.profile.email}
								</p>
							</div>

							{server.profileId !== member.profileId &&
								loadingId !== member.id && (
									<div className="ml-auto">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreVerticalIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-300" />
											</DropdownMenuTrigger>

											<DropdownMenuContent side="left">
												<DropdownMenuSub>
													<DropdownMenuSubTrigger className="flex items-center">
														<ShieldQuestionIcon className="h-4 w-4 mr-2" />
														<span>Role</span>
													</DropdownMenuSubTrigger>

													<DropdownMenuPortal>
														<DropdownMenuSubContent>
															<DropdownMenuItem
																onClick={() =>
																	member.role !== MemberRole.GUEST &&
																	onRoleChange(member.id, MemberRole.GUEST)
																}
															>
																<ShieldIcon className="h-4 w-4 mr-2" />
																Guest
																{member.role === "GUEST" && (
																	<CheckIcon className="h-4 w-4 ml-auto" />
																)}
															</DropdownMenuItem>

															<DropdownMenuItem
																onClick={() =>
																	member.role !== MemberRole.MODERATOR &&
																	onRoleChange(member.id, MemberRole.MODERATOR)
																}
															>
																<ShieldCheckIcon className="h-4 w-4 mr-2" />
																Moderator
																{member.role === "MODERATOR" && (
																	<CheckIcon className="h-4 w-4 ml-auto" />
																)}
															</DropdownMenuItem>
														</DropdownMenuSubContent>
													</DropdownMenuPortal>
												</DropdownMenuSub>

												<DropdownMenuSeparator />

												<DropdownMenuItem onClick={() => onKick(member.id)}>
													<GavelIcon className="h-4 w-4 mr-2" />
													Kick
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
							{loadingId === member.id && (
								<LoaderIcon className="h-4 w-4 ml-auto animate-spin text-zinc-400" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default MembersModal;
