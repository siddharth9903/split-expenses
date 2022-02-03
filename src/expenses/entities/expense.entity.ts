export class ExpenseModel {
    sender: string;
    reciever: string;
    amount: number;
    description: string;
}


export type ExpenseKey = {
    id?: string;
};
