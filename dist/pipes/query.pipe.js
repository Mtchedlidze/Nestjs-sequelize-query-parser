"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPipe = void 0;
const sequelize_1 = require("sequelize");
const types_1 = require("../types");
class QueryPipe {
    transform(value, metadata) {
        this.transformOrder(value);
        this.transFormPagination(value);
        if ('filter' in value) {
            value.filter = this.transFormWhereOptions(value);
        }
        return value;
    }
    transformOrder(value) {
        if (value['order']) {
            const { order } = value;
            const [columns, orderOpt] = order.split('?');
            if (!(0, types_1.isOrderType)(orderOpt.toUpperCase())) {
                throw new Error('only ASC or DESC is valid order types');
            }
            value['order'] = [(0, sequelize_1.literal)(columns), orderOpt.toUpperCase()];
        }
    }
    transFormPagination(value) {
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
    transFormWhereOptions({ filter }) {
        if (filter) {
            const obj = {};
            const filters = filter.split('^');
            filters.forEach((filter) => {
                const [column, option, value] = filter.split('.');
                if (!sequelize_1.Op[option])
                    throw new Error(`${option} is not valid filter `);
                obj[column] = {
                    [sequelize_1.Op[option]]: isNaN(+value) ? value : +value,
                };
            });
            return obj;
        }
    }
}
exports.QueryPipe = QueryPipe;
//# sourceMappingURL=query.pipe.js.map