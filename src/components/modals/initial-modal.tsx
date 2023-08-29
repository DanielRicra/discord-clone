"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { minLength, object, string, type Output } from "valibot";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "../file-upload";

const serverFormSchema = object({
	name: string([minLength(1, "Server name is required")]),
	imageUrl: string([minLength(1, "Please enter your image url")]),
});

type ServerFormData = Output<typeof serverFormSchema>;

const InitialModal = () => {
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();

	const form = useForm<ServerFormData>({
		resolver: valibotResolver(serverFormSchema),
		defaultValues: {
			name: "",
			imageUrl: "",
		},
	});

	const onSubmit = async (values: ServerFormData) => {
		try {
			await axios.post("/api/servers", values);

			form.reset();
			router.refresh();
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<Dialog open>
			<DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-white p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Customize your server
					</DialogTitle>

					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-100 text-balanced">
						Give your server a personality with a name and image. You can always
						change it later
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="serverImage"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage className="dark:text-[#f23f42] font-bold" />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-50">
											Server Name
										</FormLabel>

										<FormControl>
											<Input
												disabled={form.formState.isSubmitting}
												className="bg-zinc-200 dark:bg-[#1e1f22] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
												placeholder="Enter server name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="px-6 py-4">
							<Button
								variant="primary"
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default InitialModal;
