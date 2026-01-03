import { useState, useEffect } from "react";

export function useAuthor() {
    const [authorName, setAuthorName] = useState<string | null>(null);

    useEffect(() => {
        const savedName = localStorage.getItem("quiz_author_name");
        if (savedName) {
            setAuthorName(savedName);
        }
    }, []);

    const saveName = (name: string) => {
        localStorage.setItem("quiz_author_name", name);
        setAuthorName(name);
    };

    const logout = () => {
        localStorage.removeItem("quiz_author_name");
        setAuthorName(null);
    };

    return { authorName, saveName, logout };
}