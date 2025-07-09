import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import RecordTable from '@/layouts/record-table';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Check, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/user',
    },
];

const approveBorrowRequest = async (borrowId: number, bookId: number) => {
    router.post('/api/borrow/approve-borrow', {
        id: borrowId,
        book_id: bookId,
    });
}

const approveReturnRequest = async (borrowId: number, bookId: number) => {
    router.post('/api/borrow/approve-return', {
        id: borrowId,
        book_id: bookId,
    });
}

const banUser = async (userId: number) => {
    router.post('/api/user/ban', {
        id: userId,
    });
}

const unbanUser = async (userId: number) => {
    router.post('/api/user/unban', {
        id: userId,
    });
}

export default function User(data: any) {
    console.log('User data:', data);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className='flex flex-row gap-10  items-center w-full justify-between'>
                    <div className="flex flex-row gap-2">
                        <p className='font-bold'>Name:</p>
                        <p>{data.user.name}</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <p className='font-bold'>Email:</p>
                        <p>{data.user.email}</p>
                    </div>
                    {data.user.is_banned ? <Button className='py-1 h-fit' onClick={() => unbanUser(data.user.id)}>Unban</Button> : <Button variant="destructive" className='py-1 h-fit' onClick={() => banUser(data.user.id)}>Ban</Button>}
                </div>
                <Tabs defaultValue="borrowed_books" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="borrowed_books">Currently Borrowing Books</TabsTrigger>
                        <TabsTrigger value="pending_books">Pending Books</TabsTrigger>
                        <TabsTrigger value="reserved">Reserved Books</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="borrowed_books">
                        <RecordTable title="Currently Borrowing Books" caption="Pending for aprovals" list={data.borrowed_books} type="return"/>
                    </TabsContent>

                    <TabsContent value="pending_books">
                        <RecordTable title="Pending Books" caption="Pending for aprovals" list={[...data.pending_return, ...data.pending_borrow, ...data.pending_reserve]} type="approve"/>
                    </TabsContent>

                    <TabsContent value="reserved">
                        <RecordTable title="Reserved" caption="Pending for aprovals" list={data.reserved_books} type="reserve"/>
                    </TabsContent>
                    <TabsContent value="history">
                        <RecordTable title="History" caption="Pending for aprovals" list={data.history}/>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    )
}
