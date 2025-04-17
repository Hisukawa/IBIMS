import { Link } from "@inertiajs/react";

export default function Pagination({ links, queryParams }) {
    // Function to generate a full URL with query parameters
    const getLinkWithQueryParams = (link) => {
        if (!link.url) return null;

        const baseUrl = new URL(link.url, window.location.origin);
        const pageParam = baseUrl.searchParams.get("page");

        const urlWithQueryParams = new URL(
            window.location.pathname,
            window.location.origin
        );
        urlWithQueryParams.searchParams.set("page", pageParam);

        for (const [key, value] of Object.entries(queryParams)) {
            if (key !== "page") {
                urlWithQueryParams.searchParams.set(key, value);
            }
        }

        return urlWithQueryParams.toString();
    };

    return (
        <nav className="text-center mt-4">
            {links.map((link) => {
                const urlWithParams = getLinkWithQueryParams(link); // Get the full URL with query params

                return (
                    <Link
                        key={link.label}
                        href={urlWithParams || "#"} // Use the computed URL or fallback to #
                        className={
                            "inline-block py-2 px-3 rounded-lg text-gray-700 text-xs " +
                            (link.active ? "bg-blue-400 " : " ") +
                            (!link.url
                                ? " !text-gray-800 cursor-not-allowed "
                                : "hover:bg-blue-400 ")
                        }
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    ></Link>
                );
            })}
        </nav>
    );
}
