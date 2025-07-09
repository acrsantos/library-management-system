import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Book  {
    id: number,
    publisher_id: number,
    title: string;
    rating: number,
    description: string,
    total_page: number,
    date_published: string,
    num_ratings: number,
    star_ratings: Array<number>,
    cover_img: string,
    copies_available: number,
    copies_total: number
}

export interface PaginatedBooks {
    data: Book[];
    next_page_url: string | null;
}
