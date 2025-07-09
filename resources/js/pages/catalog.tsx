import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book} from '@/types';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

import BookCard from '@/layouts/book-card';

import { Page, PageProps } from '@inertiajs/core';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Star } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Catalog',
        href: '/catalog',
    },
];

export default function Catalog( {books} : { books: PaginatedBooks}) {
    const [bookList, setBookList] = useState(books.data);
    const [nextPageUrl, setNextPageUrl] = useState(books.next_page_url);

    const loadMore = () => {
        if (!nextPageUrl) return;
        router.get(nextPageUrl, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: { props: { books: PaginatedBooks } }) => {
                setBookList((prev: Book[]) => [...prev, ...page.props.books.data]);
                setNextPageUrl(page.props.books.next_page_url);
            }
        })
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catalog" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex gap-4">
                    <form className="flex w-full flex-nowrap gap-5" action={route('catalog.search')} method="GET">
                        <Input name="key" placeholder='    Search for book title' />
                        <Button type="submit">Submit</Button>
                    </form>
                </div>
                <div>
                    {bookList.length === 0 ? (
                        <p className='text-center text-2xl font-bold'>No books found</p>
                    ) :
                    bookList.map((book) => {
                        return <BookCard key={book.id} book={book} />
                    })}
                    {nextPageUrl && <Button className='w-full' onClick={loadMore}>Load More</Button>}
                </div>
            </div>
        </AppLayout>
    )
}
