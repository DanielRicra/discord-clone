"use client";

import "@uploadthing/react/styles.css";
import { FileIcon, XIcon } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
	endpoint: "serverImage" | "messageFile";
	value: string;
	onChange: (url?: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
	endpoint,
	onChange,
	value,
}) => {
	const fileType = value.split(".").pop();

	return (
		<>
			{value && fileType !== "pdf" ? (
				<div className="relative h-20 w-20">
					<Image
						fill
						src={value}
						alt="uploaded file"
						className="rounded-full object-cover"
					/>
					<button
						type="button"
						onClick={() => onChange("")}
						className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
					>
						<XIcon className="h-4 w-4" />
					</button>
				</div>
			) : value && fileType === "pdf" ? (
				<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
					<FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
					<a
						href={value}
						target="_blank"
						rel="noopener noreferrer"
						className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
					>
						{value}
					</a>
					<button
						type="button"
						onClick={() => onChange("")}
						className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
					>
						<XIcon className="h-4 w-4" />
					</button>
				</div>
			) : (
				<UploadDropzone
					endpoint={endpoint}
					onClientUploadComplete={(res) => {
						onChange(res?.[0]?.url);
					}}
					onUploadError={(err: Error) => {
						console.log(err);
					}}
				/>
			)}
		</>
	);
};

export default FileUpload;
