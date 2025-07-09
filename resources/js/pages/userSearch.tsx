import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book} from '@/types';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Catalog',
        href: '/catalog',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    is_banned: boolean;
    role: string;
}

interface PaginatedUser {
    data: User[];
    next_page_url: string | null;
}


export default function UserSearch( {users} : { users: PaginatedUser }) {
    const [userList, setUserList] = useState(users.data);
    const [nextPageUrl, setNextPageUrl] = useState(users.next_page_url);

    const loadMore = () => {
        if (!nextPageUrl) return;
        router.get(nextPageUrl, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (user: { props: { books: PaginatedUser } }) => {
                setUserList((prev: User[]) => [...prev, ...user.props.books.data]);
                setNextPageUrl(user.props.books.next_page_url);
            }
        })
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catalog" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex gap-4">
                    <form className="flex w-full flex-nowrap gap-5" action={route('dashboard.user.search')} method="GET">
                        <Input name="key" />
                        <Button type="submit">Submit</Button>
                    </form>
                </div>
                <Table>
                    {/* <TableCaption>Pending for aprovals</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Is banned</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userList.map((user) => {
                            return (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.is_banned ? "true" : "false"}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={route('user', { id: user.id})}>
                                        <Button variant="outline" size="sm" className="w-fit cursor-pointer">
                                            View Profile
                                        </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {nextPageUrl ? <Button className='w-full' onClick={loadMore}>Load More</Button> : <></>}
            </div>
        </AppLayout>
    )
}
