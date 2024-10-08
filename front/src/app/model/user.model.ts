export enum AuthPopupStateEnum{
    CLOSE = "CLOSE",
    OPEN = "OPEN",
}

export enum SubscriptionEnum{
    PRENIUM = "PRENIUM",
    FREE = "FREE",
}

export interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
    subcription?: SubscriptionEnum;
    imageUrl?: string;
}