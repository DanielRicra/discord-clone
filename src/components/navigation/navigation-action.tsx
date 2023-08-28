"use client";

import { PlusIcon } from "lucide-react";

import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface NavigationActionProps {}

const NavigationAction: React.FC<NavigationActionProps> = () => {
	const { onOpen } = useModal();

	return (
		<div>
			<ActionTooltip side="right" align="center" label="Add a Server">
				<div
					className="group flex items-center"
					onClick={() => onOpen("createServer")}
				>
					<div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all duration-300 overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
						<PlusIcon
							className="group-hover:text-white transition text-emerald-500 duration-300"
							size={25}
						/>
					</div>
				</div>
			</ActionTooltip>
		</div>
	);
};

export default NavigationAction;
