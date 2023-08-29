"use client";

import { useState } from "react";
import axios from "axios";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LeaveServerModal = () => {
	const {
		isOpen,
		onClose,
		type,
		data: { server },
	} = useModal();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const isModalOpen = isOpen && type === "leaveServer";

	const onConfirm = async () => {
		try {
			setIsLoading(true);

			await axios.patch(`/api/servers/${server?.id}/leave`);

			onClose();
			router.refresh();
			router.push("/");
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-white p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Leave server
					</DialogTitle>

					<DialogDescription>
						Are you sure you want to leave{" "}
						<span className="font-semibold text-indigo-500">
							{server?.name}'s
						</span>{" "}
						server?
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} variant="ghost" onClick={onClose}>
							Cancel
						</Button>

						<Button
							disabled={isLoading}
							variant="primary"
							onClick={onConfirm}
							className={cn(isLoading && "animate-pulse")}
						>
							{isLoading ? "Leaving..." : "Leave"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LeaveServerModal;
