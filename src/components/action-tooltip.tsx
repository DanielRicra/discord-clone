"use client";

import { useEffect, useState } from "react";

import {
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	Tooltip,
} from "./ui/tooltip";

interface ActionTooltipProps {
	label: string;
	children: React.ReactNode;
	side?: "left" | "right" | "top" | "bottom";
	align?: "start" | "center" | "end";
}

const ActionTooltip: React.FC<ActionTooltipProps> = ({
	children,
	label,
	align,
	side,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent side={side} align={align}>
					<p className="font-semibold text-sm capitalize">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ActionTooltip;
