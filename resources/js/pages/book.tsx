import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import RecordTable from '@/layouts/record-table';
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import BookCard from '@/layouts/book-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { DateRange } from 'react-day-picker';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Book',
        href: '/book',
    },
];

const handleSubmitBorrow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookId = formData.get('book_id');

    const startDate = formData.get('from') as string;
    const endDate = formData.get('to') as string;
    const type = formData.get('type') as string;
    console.log('Submitting borrow request for book ID:', bookId, 'from:', startDate, 'to:', endDate);

    router.post(route('book.borrow', { bookId: bookId }), {
        book_id: bookId,
        start_date: startDate,
        due_date: endDate,
        type: type
    });
}

const handleSubmitCancel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const borrowId = formData.get('borrow_book_id');

    router.post(route('book.cancel', { borrowId: borrowId }), {
        borrow_book_id: borrowId,
    });
}

const handleSubmitReturn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const borrowId = formData.get('borrow_book_id');

    router.post(route('book.return', { borrowId: borrowId }), {
        borrow_book_id: borrowId,
    });
}

const CancelPopover = ({ borrowId }: { borrowId: number }) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-full'>Cancel Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancel request?</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <form onSubmit={handleSubmitCancel} method="POST">
                            <input type="hidden" name="_token" value={csrfToken ?? ''} />
                            <input type="hidden" name="borrow_book_id" value={borrowId} />
                            <Button type="submit">Confirm</Button>
                        </form>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ReturnPopover = ({ borrowId }: { borrowId: number }) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-full'>Return</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Return the book?</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <form onSubmit={handleSubmitReturn} method="POST">
                            <input type="hidden" name="_token" value={csrfToken ?? ''} />
                            <input type="hidden" name="borrow_book_id" value={borrowId} />
                            <Button type="submit">Confirm</Button>
                        </form>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const RequestPopover = ({bookItem, userBanned}: {bookItem: Book, userBanned: boolean}) => {
    const [date, setDate] = React.useState<DateRange>({from: new Date(), to: new Date()});
    const [requestType, setRequestType] = React.useState('borrow');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    useEffect(() => {
        setDate({from: new Date(), to: new Date()});
    }, [requestType]);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-full'>Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request to Borrow</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <ToggleGroup type="single" value={requestType} onValueChange={(val) => {
                        if(val) setRequestType(val as 'borrow' | 'reserve');
                    }} className="w-full flex flex-nowrap" aria-label="Request Type">
                        <ToggleGroupItem className="flex box-content w-42" value='borrow'>Borrow</ToggleGroupItem>
                        <ToggleGroupItem className="flex box-content w-42" value='reserve'>Reserve</ToggleGroupItem>
                    </ToggleGroup>
                    <div className="grid gap-0">
                        <h1 className='m-0'>Date</h1>
                        <Calendar className="flex w-full content-center justify-center p-0" mode="range" selected={date} onSelect={(range: DateRange) => {
                            // if (range?.from && range.from < new Date(new Date().setHours(0, 0, 0, 0))) {
                            //     if (requestType === 'borrow') {
                            //         setDate({from: new Date(new Date().setHours(0, 0, 0, 0)), to: undefined});
                            //         return;
                            //     } else {
                            //         return;
                            //     }
                            // }
                            if (range?.from && range?.to) {
                                const duration = (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24);
                                if (duration > 7) {
                                    if (requestType === 'borrow') {
                                        setDate({from: new Date(range.from.getTime()), to: new Date(range.from.getTime() + 7 * 24 * 60 * 60 * 1000)});
                                        return;
                                    } else {
                                        setDate({from: undefined, to: undefined});
                                        return;
                                    }
                                }
                            }
                            setDate(range);
                        }
                        } required />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <form onSubmit={handleSubmitBorrow} method="POST">
                            <input type="hidden" name="_token" value={csrfToken ?? ''} />
                            <input type="hidden" name="book_id" value={bookItem.id} />
                            <input type="hidden" name="from" value={date?.from?.toISOString().slice(0, 10)} />
                            <input type="hidden" name="to" value={date?.to?.toISOString().slice(0,10)} />
                            <input type="hidden" name="type" value={requestType} />
                            <Button type="submit" disabled={userBanned}>Request</Button>
                        </form>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const YellowStar = ({ fill = 'currentColor' }: { fill?: string }) => {
    return (
        <Star className="text-yellow-300" fill={fill} />
    );
}

const History = ( {bookHistory, bookActive} : {bookHistory: any, bookActive: any}) => {
    const [show, setShow] = React.useState(false);
    console.log('bookActive:', bookActive);

    return (
        <>
            <Button variant="outline" className='w-full' onClick={() => setShow(!show)}>Toggle Librarian View</Button>
            {show &&
                <Tabs defaultValue="active_transaction" className="w-full h-100">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="active_transaction">Active Transactions</TabsTrigger>
                        <TabsTrigger value="book_history">Transaction History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active_transaction">
                        <RecordTable title="Active Transaction" caption="Pending for aprovals" list={bookActive} type="borrow"/>
                    </TabsContent>

                    <TabsContent value="book_history">
                        <RecordTable list={bookHistory} title="Borrow History" caption="List of all borrow requests for this book." />
                    </TabsContent>

                </Tabs>
            }
        </>
    )
}


export default function Book({ bookItem, userBorrowId, userBorrowStatus, userBorrowType, userBanned, user, bookHistory, bookActive, authorBooks }: { bookItem: Book, userBorrowId: number | undefined, userBorrowStatus: string, userBorrowType: string, userBanned: boolean, user: any, bookHistory: any, bookActive: any, authorBooks: any}) {
    console.log('userBorrowId:', userBorrowId);
    console.log('userBorrowStatus:', userBorrowStatus);
    console.log('userBorrowType:', userBorrowType);
    console.log('userBanned:', userBanned);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="bookItem" />
            <Card className="flex flex-row gap-x-0 h-fit p-10 m-5 justify-center">
                <div className="h-full flex self-center justify-center w-[600px]">
                    <img className="h-[600px] object-cover" src={bookItem.cover_img} />
                </div>
                <div className="h-full w-full flex flex-col grow-4 gap-10">
                    <CardHeader>
                        <CardTitle className='text-4xl'>{bookItem.title}</CardTitle>
                    </CardHeader>
                    <CardContent className=" w-full flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h2 className='font-bold'>Description</h2>
                            <p className='indent-10'>{bookItem.description}</p>
                        </div>
                        <div className="flex gap-2 flex-row ">
                            <h2 className='font-bold'>Language:</h2>
                            <p>{bookItem.language}</p>
                        </div>
                        <div className="flex gap-2 flex-row">
                            <h2 className='font-bold'>Author/s:</h2>
                            {bookItem.authors.map((author: any, idx: number) => (
                                <p key={author.id}><Link href={route('author.show', author.id)} className="text-indigo-400">{author.name}</Link>{idx < bookItem.authors.length - 1 && ','}</p>
                            ))}
                        </div>
                        <div className="flex gap-2 flex-row">
                            <h2 className='whitespace-nowrap w-fit font-bold'>Genre/s:</h2>
                            <div className='flex flex-wrap gap-2 gap-y-0'>
                            {bookItem.genres.map((genre: any, idx: number) => (
                                <p key={genre.id}><Link href={route('genre.show', genre.id)} className="text-indigo-400">{genre.name}</Link>{idx < bookItem.genres.length - 1 && ','}</p>
                            ))}
                            </div>
                        </div>
                        <div className="flex gap-2 flex-row">
                            <h2 className='font-bold'>Date Published:</h2>
                            {new Date(bookItem.date_published).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                        </div>
                        <div className="flex gap-2 flex-col">
                            <span className='flex gap-2'><h2 className='font-bold'>Total Rating: </h2><YellowStar/> {bookItem.rating}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex w-full">
                        { (userBorrowId && (userBorrowType === "borrow" && userBorrowStatus === "approved") || (userBorrowType === "return" && userBorrowStatus === "rejected")) ? <ReturnPopover borrowId={userBorrowId} /> :
                            (userBorrowId && (userBorrowStatus === "pending" || userBorrowType === "reserve")) ? <CancelPopover borrowId={userBorrowId} /> :
                                <RequestPopover bookItem={bookItem} userBanned={userBanned}/>
                        }
                    </CardFooter>

                </div>
            </Card>
            {authorBooks.length > 0 && <>
                <h1 className='text-2xl font-bold'>More books from the author/s</h1>
                <Carousel>
                    <CarouselContent className='w-full'>
                        {authorBooks.map((book: any) => (
                            <CarouselItem>
                                <BookCard key={book.id} book={book} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </>
            }
            {(user.role === "librarian") && <History bookHistory={bookHistory} bookActive={bookActive} /> }
        </AppLayout>
    )
}
