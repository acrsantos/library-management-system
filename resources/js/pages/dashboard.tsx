import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import RecordTable from '@/layouts/record-table';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard(data: any) {
    console.log('Dashboard data:', data);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Link  className="max-w-fit max-h-fit" href={route('dashboard.user')}>
                    <Button className="mb-4" variant="outline">
                        View Users
                    </Button>
                </Link>
                <Tabs defaultValue="pending_borrow" className="w-full">
                    <TabsList className="grid w-full grid-cols-7">
                        <TabsTrigger value="pending_borrow">Borrow Request</TabsTrigger>
                        <TabsTrigger value="pending_return">Return Request</TabsTrigger>
                        <TabsTrigger value="pending_reserve_borrow">Reserve Request</TabsTrigger>
                        <TabsTrigger value="pending_reserve"> Reserved Books</TabsTrigger>
                        <TabsTrigger value="borrowed_books">Borrowed Books</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="overdue_books">Overdue Borrow</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending_borrow">
                        <RecordTable title="Pending Borrow" caption="Pending for aprovals" list={data.pending_borrow} type="borrow"/>
                    </TabsContent>

                    <TabsContent value="pending_return">
                        <RecordTable title="Pending Return" caption="Pending for aprovals" list={data.pending_return} type="return"/>
                    </TabsContent>

                    <TabsContent value="pending_reserve_borrow">
                        <RecordTable title="Pending Reserve" caption="Pending for aprovals" list={data.pending_reserve} type="borrow"/>
                    </TabsContent>

                    <TabsContent value="pending_reserve">
                        <RecordTable title="Pending Reserve Borrow" caption="Pending for aprovals" list={data.pending_reserve_borrow} type="borrow"/>
                    </TabsContent>

                    <TabsContent value="borrowed_books">
                        <RecordTable title="Borrowed Books" type="return" caption="Pending for aprovals" list={data.borrowed_books}/>
                    </TabsContent>

                    <TabsContent value="history">
                        <RecordTable title="History" caption="Pending for aprovals" list={data.history}/>
                    </TabsContent>

                    <TabsContent value="overdue_books">
                        <RecordTable title="History" caption="Pending for aprovals" list={data.overdue_books}/>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
