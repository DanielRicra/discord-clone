"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";

interface ServerSearchProps {
	data: {
		label: string;
		type: "channel" | "member";
		data:
			| {
					icon: React.ReactNode;
					name: string;
					id: string;
			  }[]
			| undefined;
	}[];
}

const ServerSearch: React.FC<ServerSearchProps> = ({ data }) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const params = useParams();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				setIsOpen(true);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const onClickSelectedItem = ({
		id,
		type,
	}: { id: string; type: "channel" | "member" }) => {
		setIsOpen(false);

		if (type === "member") {
			return router.push(`/servers/${params.serverId}/conversations/${id}`);
		}

		if (type === "channel") {
			return router.push(`/servers/${params.serverId}/channels/${id}`);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
			>
				<SearchIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
				<p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
					Search
				</p>
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
					<span className="text-xs">Ctrl/⌘+</span>k
				</kbd>
			</button>

			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput placeholder="Search channels and members" />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{data.map(({ label, type, data }) => {
						if (!data?.length) return null;
						return (
							<CommandGroup key={label} heading={label}>
								{data?.map(({ id, icon, name }) => (
									<CommandItem
										key={id}
										onSelect={() => onClickSelectedItem({ id, type })}
									>
										{icon}
										<span>{name}</span>
									</CommandItem>
								))}
							</CommandGroup>
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default ServerSearch;
