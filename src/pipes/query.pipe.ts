import { BadRequestException, PipeTransform } from '@nestjs/common'
import { literal, Op, WhereOptions, GroupOption } from 'sequelize'
import { isOrderType } from '../types'

export class QueryPipe implements PipeTransform {
  transform(query: any) {
    this.transformOrder(query)
    this.transformPagination(query)
    this.transformWhereOptions(query)
    return query
  }

  private transformOrder({ order }): void {
    if (order) {
      const [columns, orderOpt] = order.split('?') as string

      if (!isOrderType(orderOpt.toUpperCase())) {
        throw new BadRequestException('only ASC or DESC is valid order types')
      }

      order = [literal(columns), orderOpt.toUpperCase()]
    }
  }

  private transformPagination({ limit, offset }): void {
    if (limit) {
      if (isNaN(+limit)) {
        throw new Error('only number is allowed for limit value')
      }
      limit = +limit
    }
    if (offset) {
      if (isNaN(+offset)) {
        throw new Error('only number is allowed for offset value')
      }
      offset = +offset
    }
  }

  private transformWhereOptions({ filter }): void {
    if (filter) {
      const filterOptions: WhereOptions<any> = {}

      const filters = filter.split('^') as string[]
      filters.forEach((filter) => {
        const [column, option, value] = filter.split('.')
        if (!Op[option]) {
          const errorMessage = `${option} is not valid option for filter, there are valid options: ${Object.keys(
            Op
          )}`
          throw new BadRequestException(errorMessage)
        }

        filterOptions[column] = {
          [Op[option]]: isNaN(+value) ? value : +value,
        }
      })
      filter = filterOptions
    }
  }
}
