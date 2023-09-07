"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { minLength, object, string, type Output } from "valibot";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "../file-upload";
import { useModal } from "@/hooks/use-modal-store";

const serverFormSchema = object({
	fileUrl: string([minLength(1, "Attachment is required")]),
});

type ServerFormData = Output<typeof serverFormSchema>;

const MessageFileModal = () => {
	const {
		isOpen,
		onClose,
		type,
		data: { apiUrl, query },
	} = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "messageFile";

	const form = useForm<ServerFormData>({
		resolver: valibotResolver(serverFormSchema),
		defaultValues: { fileUrl: "" },
	});

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const onSubmit = async (values: ServerFormData) => {
		try {
			await axios.post(
				`${apiUrl || ""}?${new URLSearchParams(query).toString()}`,
				{ ...values, content: values.fileUrl },
			);

			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-white p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Add an attachment
					</DialogTitle>

					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-100 text-balanced">
						Send file as a message
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="messageFile"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage className="dark:text-[#f23f42] font-bold" />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<DialogFooter className="px-6 py-4">
							<Button
								variant="primary"
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? "Sending..." : "Send"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default MessageFileModal;
