import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book, type PaginatedBooks } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import BookCard from '@/layouts/book-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Author',
        href: '/author',
    },
];

export default function Genre({ books, genre }: { books: PaginatedBooks, genre: string }) {
    const [bookList, setBookList] = useState(books.data);
    const [nextPageUrl, setNetxtPageUrl] = useState(books.next_page_url);
    const loadMore = () => {
        if (!nextPageUrl) return;
        router.get(nextPageUrl, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: { props: { books: PaginatedBooks } }) => {
                setBookList((prev: Book[]) => [...prev, ...page.props.books.data]);
                setNetxtPageUrl(page.props.books.next_page_url)
            }
        }
        )
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Genre" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 justify-center items-center">
                <h1 className='text-2xl font-bold'>{genre}</h1>
                <div>
                    {bookList.map((book) => {
                        return <BookCard key={book.id} book={book} />
                    })}
                    {nextPageUrl && <Button className='w-full' onClick={loadMore}>Load More</Button>}
                </div>
            </div>
        </AppLayout>
    )
}
