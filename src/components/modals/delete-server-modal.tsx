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

const DeleteServerModal = () => {
	const {
		isOpen,
		onClose,
		type,
		data: { server },
	} = useModal();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const isModalOpen = isOpen && type === "deleteServer";

	const onConfirm = async () => {
		try {
			setIsLoading(true);

			await axios.delete(`/api/servers/${server?.id}`);

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
						Delete Server
					</DialogTitle>

					<DialogDescription className="text-center">
						Are you sure you want to do this? <br />
						<span className="text-indigo-500 font-semibold">
							{server?.name}
						</span>{" "}
						will be deleted permanently.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} variant="ghost" onClick={onClose}>
							Cancel
						</Button>

						<Button
							disabled={isLoading}
							variant="destructive"
							onClick={onConfirm}
							className={cn("bg-[#f23f42e1]", isLoading && "animate-pulse")}
						>
							{isLoading ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteServerModal;
