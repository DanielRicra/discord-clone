"use client";

import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { cn } from "@/lib/utils";

const InviteModal = () => {
	const { isOpen, onClose, type, data, onOpen } = useModal();
	const origin = useOrigin();

	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const inviteUrl = `${origin}/invite/${data.server?.inviteCode}`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(inviteUrl).then(() => {
			setCopied(true);
		});

		setTimeout(() => {
			setCopied(false);
		}, 1500);
	};

	const onNew = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(
				`/api/servers/${data.server?.id}/invite-code`,
			);

			onOpen("invite", { server: response.data });
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	const isModalOpen = isOpen && type === "invite";

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-white p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Customize your server
					</DialogTitle>
				</DialogHeader>

				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-50">
						Server invite link
					</Label>

					<div className="bg-zinc-200 dark:bg-[#1e1f22] p-1 flex items-center justify-between mt-2 gap-x-2 rounded-sm">
						<p className="text-black dark:text-white truncate px-1 flex-1 md:max-w-[328px] max-w-[240px]">
							{inviteUrl}
						</p>
						<Button
							disabled={isLoading}
							size="sm"
							onClick={copyToClipboard}
							className={cn(
								"bg-[#5865f2] text-white hover:bg-[#5865f2]/70 px-5 rounded-sm",
								copied && "bg-green-600 hover:bg-green-600/70",
							)}
						>
							{copied ? "Copied" : "Copy"}
						</Button>
					</div>

					<Button
						disabled={isLoading}
						variant="link"
						size="sm"
						onClick={onNew}
						className="text-xs text-zinc-500 dark:text-zinc-200 dark:hover:text-zinc-400 hover:text-zinc-700 dark:test-zinc-50 mt-4"
					>
						Generate a new Link
						<RefreshCwIcon
							className={cn("w-4 h-4 ml-2", isLoading && "animate-spin")}
						/>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default InviteModal;
