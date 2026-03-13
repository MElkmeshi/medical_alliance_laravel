import { Link, usePage } from '@inertiajs/react';
import { Building2, ClipboardList, ClipboardPlus, LayoutGrid, Stethoscope, UserRound, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, User } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Examinations',
        href: '/admin/examinations',
        icon: Stethoscope,
    },
    {
        title: 'Examination Profiles',
        href: '/admin/examination-profiles',
        icon: ClipboardList,
    },
    {
        title: 'Companies',
        href: '/admin/companies',
        icon: Building2,
    },
    {
        title: 'Employees',
        href: '/admin/employees',
        icon: UserRound,
    },
    {
        title: 'Checkups',
        href: '/admin/checkups',
        icon: ClipboardPlus,
    },
];

const companyNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/company/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Employees',
        href: '/company/employees',
        icon: Users,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const navItems = auth.user.role === 'admin' ? adminNavItems : companyNavItems;
    const homeHref = auth.user.role === 'admin' ? '/admin/dashboard' : '/company/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
