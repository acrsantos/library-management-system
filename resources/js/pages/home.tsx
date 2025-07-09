import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book } from '@/types';
import { Head, Link } from '@inertiajs/react';

import BookCard from '@/layouts/book-card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Catalog',
        href: '/catalog',
    },
];

export default function Home({
    borrowed_books,
    pending_books,
    reserved_books,
}: {
    borrowed_books: Book[],
    pending_books: Book[],
    reserved_books: Book[]}
) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catalog" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <Tabs defaultValue="borrowed-books" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="borrowed-books">Borrowed Books</TabsTrigger>
                            <TabsTrigger value="pending-books">Pending Books</TabsTrigger>
                            <TabsTrigger value="reserved-books">Reserved Books</TabsTrigger>
                        </TabsList>
                        <TabsContent value="borrowed-books">
                            {(borrowed_books.length > 0) ? borrowed_books.map((book: Book) => {
                                return <BookCard key={book.id} book={book} />
                            }): <Card><CardContent className='h-50 flex justify-center items-center size-full rounded-xl'><p>Nothing to show here.</p></CardContent></Card>}
                        </TabsContent>
                        <TabsContent value="pending-books">
                            {(pending_books.length > 0) ? pending_books.map((book: Book) => {
                                return <BookCard key={book.id} book={book} />
                            }): <Card><CardContent className='h-50 flex justify-center items-center size-full rounded-xl'><p>Nothing to show here.</p></CardContent></Card>}
                        </TabsContent>
                        <TabsContent value="reserved-books">
                            {(reserved_books.length > 0) ? reserved_books.map((book: Book) => {
                                return <BookCard key={book.id} book={book} />
                            }): <Card><CardContent className='h-50 flex justify-center items-center size-full rounded-xl'><p>Nothing to show here.</p></CardContent></Card>}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    )
}
