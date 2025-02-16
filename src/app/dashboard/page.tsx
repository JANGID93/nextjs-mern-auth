"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const [token, setToken] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const router = useRouter();

    const PRODUCTS_PER_PAGE = 10; // Set limit for pagination

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/login");
            return;
        }
        setToken(storedToken);

        // Fetch total records
        const fetchTotalRecords = async () => {
            try {
                const response = await fetch("/api/products");

                if (!response.ok) {
                    throw new Error("Failed to fetch total records");
                }

                const allProducts = await response.json();
                const totalRecords = allProducts.length;
                setTotalPages(Math.ceil(totalRecords / PRODUCTS_PER_PAGE));
            } catch (error) {
                setError("Error fetching total records");
            }
        };

        fetchTotalRecords();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError("Error fetching products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="container mt-5">
            <h1>Dashboard</h1>
            {token ? <p>Welcome! You are logged in.</p> : <p>Redirecting...</p>}

            <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>

            {loading && <p>Loading products...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && products.length > 0 ? (
                <>
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.Price}</td>
                                    <td>{product.Amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            className="btn btn-primary"
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                !loading && <p>No products found.</p>
            )}
        </div>
    );
};

export default Dashboard;
