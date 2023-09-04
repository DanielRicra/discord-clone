import { MenuIcon } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";

interface MobileToggleProps {
	serverId: string;
}

const MobileToggle: React.FC<MobileToggleProps> = ({ serverId }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<MenuIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
				</Button>
			</SheetTrigger>

			<SheetContent side="left" className="p-0 flex gap-0">
				<div className="w-[72px]">
					<NavigationSidebar />
				</div>

				<ServerSidebar serverId={serverId} />
			</SheetContent>
		</Sheet>
	);
};

export default MobileToggle;
