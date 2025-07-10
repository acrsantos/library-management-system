import { Head, router, Link } from '@inertiajs/react';
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
import { Check, X } from 'lucide-react';

const approveBorrowRequest = async (borrowId: number, bookId: number, type: string) => {
    console.log('Approving borrow request', borrowId, bookId, type);
    router.post('/api/borrow/approve-borrow', {
        id: borrowId,
        book_id: bookId,
        type: type,
    });
}

const approveReturnRequest = async (borrowId: number, bookId: number) => {
    router.post('/api/borrow/approve-return', {
        id: borrowId,
        book_id: bookId,
    });
}

const rejectBorrowRequest = async (borrowId: number, bookId: number) => {
    router.post('/api/borrow/reject-borrow', {
        id: borrowId,
        book_id: bookId,
    });
}

const rejectReturnRequest = async (borrowId: number, bookId: number) => {
    router.post('/api/borrow/reject-return', {
        id: borrowId,
        book_id: bookId,
    });
}

const cancelRequest = async (borrowId: number, bookId: number) => {
    router.post('/api/borrow/cancel-request', {
        id: borrowId,
        book_id: bookId,
    });
}

export default function RecordTable({title, caption, list, type } : { title: any, caption: any, list: any, type?: any}) {
    return (
        <>
        {/* <h2 className="text-2xl font-bold">{title}</h2> */}
        <Table>
            {/* <TableCaption>{caption}</TableCaption> */}
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    {type && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                    {list.length === 0 && (<TableRow>
                        <TableCell colSpan={type ? 7 : 6} className="text-center">
                            Empty
                        </TableCell>
                        </TableRow>)}
                {list.map((txn) => {
                    return (
                        <TableRow key={txn.id}>
                            <TableCell className="font-medium"><Link href={route('user', { id: txn.transaction.user.id})}>{txn.transaction.user.name}</Link></TableCell>
                            <TableCell>{txn.book.title}</TableCell>
                            <TableCell>{txn.type}</TableCell>
                            <TableCell>{txn.start_date}</TableCell>
                            <TableCell>{txn.due_date}</TableCell>
                            <TableCell className='text-right'>{txn.status}</TableCell>
                                { type && (
                                    ((txn.type === "borrow" || txn.type === "reserve" ) && txn.status === "pending") ? (
                                        <TableCell className="text-right">
                                            <Button onClick={() => approveBorrowRequest(txn.id, txn.book_id, txn.type)} variant="outline" size="sm" className="w-fit">
                                                Approve
                                            </Button>
                                            <Button onClick={() => rejectBorrowRequest(txn.id, txn.book_id)} variant="outline" size="sm" className="w-fit">
                                                Reject
                                            </Button>
                                        </TableCell>
                                    ) : ((txn.type === 'return') && txn.status === "pending") ? (
                                            <TableCell className="text-right">
                                                <Button onClick={() => approveReturnRequest(txn.id, txn.book_id)} variant="outline" size="sm" className="w-fit">
                                                    Approve
                                                </Button>
                                                <Button onClick={() => rejectReturnRequest(txn.id, txn.book_id)} variant="outline" size="sm" className="w-fit">
                                                    Reject
                                                </Button>
                                            </TableCell>
                                    ) : (txn.type === 'borrow' && txn.status === "approved") ? (
                                            <TableCell className="text-right">
                                                <Button onClick={() => approveReturnRequest(txn.id, txn.book_id)} variant="outline" size="sm" className="w-fit">
                                                        Mark as returned
                                                </Button>
                                            </TableCell>
                                    ) : (txn.type === 'reserve' && txn.status === "approved" && txn.start_date === new Date().toISOString().slice(0, 10)) ? (
                                            <TableCell className="text-right">
                                            <Button onClick={() => approveBorrowRequest(txn.id, txn.book_id, "borrow")} variant="outline" size="sm" className="w-fit">
                                                Approve
                                            </Button>
                                            <Button onClick={() => rejectBorrowRequest(txn.id, txn.book_id)} variant="outline" size="sm" className="w-fit">
                                                Reject
                                            </Button>
                                            </TableCell>
                                    ) : (txn.type === 'reserve' && txn.status === "approved") ? (
                                            <TableCell className="text-right">
                                                <Button onClick={() => cancelRequest(txn.id, txn.book_id)} variant="outline" size="sm" className="w-fit">
                                                        Cancel
                                                </Button>
                                            </TableCell>
                                    ) : (txn.type === 'return' && txn.status === "pending") ? (
                                            <TableCell className="text-right">
                                                <Button onClick={() => approveReturnRequest(txn.id, txn.book_id)} variant="outline" size="sm" className="w-fit">
                                                    <Check  />
                                                </Button>
                                                <Button onClick={() => rejectReturnRequest(txn.id, txn.book_id)} variant="outline" size="sm" className="w-fit">
                                                    <X  />
                                                </Button>
                                            </TableCell>
                                        ) : <></>)}

                            </TableRow>
                        )
                    })}
            </TableBody>
        </Table>
    </>
    )
}
