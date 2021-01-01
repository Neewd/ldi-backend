declare module '@ioc:LaDouceImpatience/PromotionService' {
  import { FixedDiscount } from "App/Models/Interface/FixedDiscount";
  import { ItemFixedDiscount } from "App/Models/Interface/ItemFixedDiscount";
  import { ItemPercentDiscount } from "App/Models/Interface/ItemPercentDiscount";
  import { PercentDiscount } from "App/Models/Interface/PercentDiscount";
  import { XforYDiscount } from "App/Models/Interface/XforYDiscount";
  import { XforAmountDiscount } from "App/Models/Interface/XforAmountDiscount";
  
  export interface PromotionInterface {
    isFixedDiscount(schema: any): schema is FixedDiscount;
    isItemFixedDiscount(schema: any): schema is ItemFixedDiscount;
    isItemPercentDiscount(schema: any): schema is ItemPercentDiscount;
    isPercentDiscount(schema: any): schema is PercentDiscount;
    isXforYDiscount(schema: any): schema is XforYDiscount;
    isXforAmountDiscount(schema: any): schema is XforAmountDiscount;
  }
  
  const PromotionService: PromotionInterface
  export default PromotionService
}