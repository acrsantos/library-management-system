import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Book} from '@/types';
import { Link } from '@inertiajs/react';


import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Star } from 'lucide-react';

export default function BookCard( {book, key}: { book: Book, key: number }) {
    console.log(book);
    return <Card className="flex flex-row gap-4 m-1 p-5 max-h-fit" key={book.id}>
        <div className="w-[150px] h-[300px] flex justify-center items-center max-h-[200px]">
            <img src={book.cover_img} className="object-cover" />
        </div>
        <div className="w-full flex flex-col justify-between p-0 gap-0 max-h-fit">
            <CardHeader className="p-0">
                <CardTitle className='font-extrabold text-xl'><Link href={route('book.show', { id: book.id })}>{book.title}</Link></CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[200px] overflow-hidden indent-10">
                {book.description.length > 400 ? `${book.description.slice(0, 400)}...` : book.description}
            </CardContent>
            <CardFooter className="flex justify-between p-0">
                <div className="flex items-center gap-2">
                    <p className='font-bold'>Language: </p> {book.language}
                </div>
                <div className="flex items-center gap-2">
                    <Star className='text-yellow-400' fill='currentColor'/> {book.rating}
                </div>
            </CardFooter>
        </div>
    </Card>

}
