import styles from "../styles/Home.module.css"

export default function Pagination(props) {

    const data = props.data
    const pageNumber = props.pageNumber
    const setPageNumber = props.setPageNumber

    const nextPage = () => {
        if (data.data.pagination.has_more == true) {
            pageNumber = pageNumber + 1
            setPageNumber(pageNumber)
        }
        else {
            console.log("Sorry, You have reached the limit!")
        }
    }

    const prevPage = () => {
        if (pageNumber == 0) {
            console.log("Sorry, You have reached the limit!")
        }
        else {
            pageNumber = pageNumber - 1
            setPageNumber(pageNumber)
        }
    }

    return (
        <div>
            <button className={pageNumber > 0 ? styles.paginationButton : styles.paginationButtonLimit} onClick={prevPage}>Previous</button>
            Page {pageNumber + 1}
            <button className={data?.data?.pagination?.has_more ? styles.paginationButton : styles.paginationButtonLimit} onClick={nextPage}>Next</button>
        </div>
    )
}
