import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import type { IsidebarItems } from '@/types';
import { usePathname, useRouter } from 'next/navigation';

interface NavMainProps {
  sidebarData: IsidebarItems[];
}

export function NavMain({ sidebarData }: NavMainProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1 px-2">
        <SidebarMenu>
          {sidebarData.map((item) => {
            const isActive = pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title} className="overflow-hidden">
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`w-full relative cursor-pointer overflow-hidden px-3 h-10 rounded-lg transition-colors duration-200 ${isActive
                    ? 'bg-muted text-foreground font-semibold'
                    : 'hover:bg-muted text-foreground'
                    }`}
                  isActive={isActive}
                  onClick={() => router.push(item.url)}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-sm" />
                  )}
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
};