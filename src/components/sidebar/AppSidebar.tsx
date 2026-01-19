import { NavMain } from './NavMain';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import type { IsidebarItems } from '@/types';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { sidebarData: IsidebarItems[] };

export function AppSidebar({ sidebarData, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='mt-3 px-2'>
            <span className="text-2xl font-black tracking-tight bg-linear-to-b from-primary via-primary to-foreground bg-clip-text text-transparent">
              GrowStrongHub
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='mt-1'>
        <NavMain sidebarData={sidebarData} />
      </SidebarContent>
    </Sidebar>
  );
};