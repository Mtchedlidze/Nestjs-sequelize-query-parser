import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { literal, Op } from 'sequelize';
import { isOrderType } from '../types';
export class QueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    this.transformOrder(value);
    this.transFormPagination(value);
    if ('filter' in value) {
      value.filter = this.transFormWhereOptions(value);
    }
    return value;
  }

  private transformOrder(value) {
    if (value['order']) {
      const { order } = value;
      const [columns, orderOpt] = order.split('?') as string;

      if (!isOrderType(orderOpt.toUpperCase())) {
        throw new Error('only ASC or DESC is valid order types');
      }

      value['order'] = [literal(columns), orderOpt.toUpperCase()];
    }
  }

  private transFormPagination(value) {
    if (value['limit']) {
      if (isNaN(+value['limit'])) {
        throw new Error('only number is allowed for limit value');
      }
      value['limit'] = +value['limit'];
    }
    if (value['offset']) {
      if (isNaN(+value['offset'])) {
        throw new Error('only number is allowed for offset value');
      }
      value['offset'] = +value['offset'];
    }
  }

  private transFormWhereOptions({ filter }) {
    if (filter) {
      const obj = {};
      const filters = filter.split('^') as string[];
      filters.forEach((filter) => {
        const [column, option, value] = filter.split('.');
        if (!Op[option]) throw new Error(`${option} is not valid filter `);

        obj[column] = {
          [Op[option]]: isNaN(+value) ? value : +value,
        };
      });
      return obj;
    }
  }
}
