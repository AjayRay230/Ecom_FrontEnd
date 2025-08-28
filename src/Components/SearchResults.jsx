import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const query = useQuery();
    const keyword = query.get("keyword");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8); 

    useEffect(() => {
        if (keyword) {
            setLoading(true);
            axios.get(`https://ecom-backend-rt2i.onrender.com/api/product/search?keyword=${keyword}`)
                .then((res) => setProducts(res.data))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [keyword]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    return (
        <div className="sr-container">
            <h2>Search results for "{keyword}"</h2>
            <div className="sr-products">
                {loading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="sr-card shimmer"></div>
                    ))
                ) : products.length > 0 ? (
                    products.slice(0, visibleCount).map(p => (
                        <div key={p.id} className="sr-card">
                            <a href={`/product/${p.id}`}>
                                <img src={p.imageUrl} alt={p.name} />
                                <p className="sr-name">{p.name}</p>
                                <p className="sr-price">${p.price}</p>
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
            {products.length > visibleCount && !loading && (
                <button className="sr-load-more" onClick={handleLoadMore}>Load More</button>
            )}
        </div>
    );
}

export default SearchResults;
