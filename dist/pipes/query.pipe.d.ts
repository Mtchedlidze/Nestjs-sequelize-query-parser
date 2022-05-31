import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class QueryPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
    private transformOrder;
    private transFormPagination;
    private transFormWhereOptions;
}
//# sourceMappingURL=query.pipe.d.ts.map