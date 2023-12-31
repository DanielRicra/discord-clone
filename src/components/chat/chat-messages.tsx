"use client";

import { Fragment } from "react";
import { Loader2Icon, ServerCrashIcon } from "lucide-react";
import { Member } from "@prisma/client";
import { format } from "date-fns";

import ChatWelcome from "./chat-welcome";
import { MessageWithMemberWithProfile } from "@/types";
import { useChatQuery } from "@/hooks/use-chat-query";
import ChatItem from "./chat-item";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: "channelId" | "conversationId";
	paramValue: string;
	type: "channel" | "conversation";
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
	apiUrl,
	chatId,
	member,
	name,
	paramKey,
	paramValue,
	socketQuery,
	socketUrl,
	type,
}) => {
	const queryKey = `chat:${chatId}`;

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

	return status === "loading" ? (
		<div className="flex flex-col flex-1 justify-center items-center">
			<Loader2Icon className="h-7 w-7 text-zinc-500 animate-spin my-4" />
			<p className="text-xs text-zinc-500 dark:text-zinc-400">
				Loading Messages...
			</p>
		</div>
	) : status === "error" ? (
		<div className="flex flex-col flex-1 justify-center items-center">
			<ServerCrashIcon className="h-7 w-7 text-zinc-500 animate-spin my-4" />
			<p className="text-xs text-zinc-500 dark:text-zinc-400">
				Something went wrong!
			</p>
		</div>
	) : (
		<div className="flex-1 flex flex-col py-4 overflow-y-auto">
			<div className="flex-1" />
			<ChatWelcome type={type} name={name} />
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages.map((group, i) => (
					// rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Fragment key={i}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<ChatItem
								key={message.id}
								id={message.id}
								currentMember={member}
								member={message.member}
								content={message.content}
								fileUrl={message.fileUrl}
								deleted={message.deleted}
								timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
								isUpdated={message.updatedAt !== message.createdAt}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
							/>
						))}
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default ChatMessages;
