"use client"

import { memo } from "react"
import ReactPaginate from "react-paginate"

function Pagination({
  postCount,
  handlePageClick,
  itemsPerPage,
  cursor,
}: {
  postCount: number | undefined
  handlePageClick: (event: any) => void
  itemsPerPage: number
  cursor: string | null | undefined
}) {
  const pageCount = Math.ceil((postCount ?? 0) / itemsPerPage)

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={">"}
      onPageChange={handlePageClick}
      forcePage={parseInt(cursor ?? "0")}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      previousLabel="<"
      renderOnZeroPageCount={null}
      className="global-pagination"
      activeClassName="active"
      disabledClassName="disable"
    />
  )
}

export default memo(Pagination)
