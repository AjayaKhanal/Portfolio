const Pagination = ({ current, total, onPageChange }) => {
    if (total <= 1) return null;
    const pages = Array.from({ length: total }, (_, i) => i + 1);
    return (
        <div className="pagination">
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={page === current ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
