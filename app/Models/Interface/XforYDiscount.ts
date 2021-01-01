export interface XforYDiscount {
    x: string; // Number of items required to activate the promotion
    y: string; // Number of items that are used to calculate the total charge
    targets: string[]; // productIds
}