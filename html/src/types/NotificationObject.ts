type NotificationObject = {
    title: string;
    message: string;
    type: string;

    createdAt: Date;
    checksum: string;
    seed: number;
    stackAmount: number;

    reset: boolean;

    options: NotificationObjectOptions;
}