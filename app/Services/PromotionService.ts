import { FixedDiscount } from "App/Models/Interface/FixedDiscount";
import { ItemFixedDiscount } from "App/Models/Interface/ItemFixedDiscount";
import { ItemPercentDiscount } from "App/Models/Interface/ItemPercentDiscount";
import { PercentDiscount } from "App/Models/Interface/PercentDiscount";
import { XforYDiscount } from "App/Models/Interface/XforYDiscount";
import { XforAmountDiscount } from "App/Models/Interface/XforAmountDiscount";
import { PromotionInterface } from "@ioc:LaDouceImpatience/PromotionService";

export default class PromotionService implements PromotionInterface  {

    isFixedDiscount(schema: any): schema is FixedDiscount {
        return schema?.currency && typeof(schema?.currency) == 'string'
            && schema?.amount && typeof(schema?.amount) == 'number';
    }

    isItemFixedDiscount(schema: any): schema is ItemFixedDiscount {
        return schema?.targets && typeof(schema?.targets) == 'object'
            && schema?.amount && typeof(schema?.amount) == 'number'
            && schema?.currency && typeof(schema?.currency) == 'string';
    }

    isItemPercentDiscount(schema: any): schema is ItemPercentDiscount {
        return schema?.targets && typeof(schema?.targets) == 'object'
            && schema?.percent && typeof(schema?.percent) == 'number';
    }

    isPercentDiscount(schema: any): schema is PercentDiscount {
        return schema?.currency && typeof(schema?.currency) == 'string'
            && schema?.percentage && typeof(schema?.percentage) == 'number';
    }

    isXforYDiscount(schema: any): schema is XforYDiscount {
        return schema?.x && typeof(schema?.x) == 'string'
            && schema?.y && typeof(schema?.y) == 'string'
            && schema?.targets && typeof(schema?.targets) == 'object';
    }

    isXforAmountDiscount(schema: any): schema is XforAmountDiscount {
        return schema?.x && typeof(schema?.x) == 'string'
            && schema?.y && typeof(schema?.y) == 'string'
            && schema?.targets && typeof(schema?.targets) == 'object';
    }

}