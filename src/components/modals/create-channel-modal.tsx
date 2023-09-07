"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { minLength, object, string, nativeEnum, type Output } from "valibot";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const channelFormSchema = object({
	name: string([
		minLength(1, "Channel name is required"),
		(input) => {
			if (input === "general") {
				return {
					issue: {
						validation: "custom",
						message: "This channel name is reserved",
						input,
					},
				};
			}
			return { output: input };
		},
	]),
	type: nativeEnum(ChannelType),
});

type ServerFormData = Output<typeof channelFormSchema>;

const CreateChannelModal = () => {
	const {
		isOpen,
		onClose,
		type,
		data: { channelType },
	} = useModal();
	const router = useRouter();
	const params = useParams();

	const isModalOpen = isOpen && type === "createChannel";

	const form = useForm<ServerFormData>({
		resolver: valibotResolver(channelFormSchema),
		defaultValues: {
			name: "",
			type: ChannelType.TEXT,
		},
	});

	const onSubmit = async (values: ServerFormData) => {
		try {
			await axios.post(`/api/channels?serverId=${params?.serverId}`, values);

			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	useEffect(() => {
		if (channelType) {
			form.setValue("type", channelType);
		}
	}, [channelType]);

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-white p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Create Channel
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-50">
											Channel Name
										</FormLabel>

										<FormControl>
											<Input
												disabled={form.formState.isSubmitting}
												className="bg-zinc-300/50 dark:bg-[#1e1f22] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
												placeholder="Enter channel name"
												{...field}
											/>
										</FormControl>
										<FormMessage className="dark:text-[#f23f42] font-bold" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Type</FormLabel>
										<Select
											disabled={form.formState.isSubmitting}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-zinc-300/50 dark:bg-[#1e1f22] border-none focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
													<SelectValue placeholder="Select a channel type" />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												{Object.values(ChannelType).map((type) => (
													<SelectItem
														key={type}
														value={type}
														className="capitalize"
													>
														{type.toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage className="dark:text-[#f23f42] font-bold" />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="px-6 py-4">
							<Button variant="primary" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? "Creating..." : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateChannelModal;
