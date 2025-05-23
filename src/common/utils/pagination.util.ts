import { PaginationDto } from '../dtos/pagination.dto';

export function paginate(paginationDto: PaginationDto) {
  let { page = 0, limit = 10 } = paginationDto;

  if (!page || page <= 1) page = 0;
  else page = page - 1;

  if (!limit || limit <= 0) limit = 10;

  let skip = page * limit;

  return {
    page: page === 0 ? 1 : page,
    limit,
    skip,
  };
}

export function paginationData(count: number, page: number, limit: number) {
  return {
    totalCount: count,
    page: +page,
    limit: +limit,
    pageCount: Math.ceil(count / limit),
  };
}
