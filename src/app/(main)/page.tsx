import { UserButton } from "@clerk/nextjs";

export default function Home() {
	return (
		<div>
			<p className="text-3xl font-bold underline">discord Clone!</p>
			<UserButton afterSignOutUrl="/" />
		</div>
	);
}
