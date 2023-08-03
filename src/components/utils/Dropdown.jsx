import { useState, useMemo, useTransition, useRef, useEffect } from "react";
import _ from "lodash";

const Dropdown = ({ data, label, sortBy, value, register, registerName, setValue, defaultValue, reset }) => {
    const [query, setQuery] = useState("");
    const [showDropDown, setShowDropDown] = useState(false);
    const [isSearching, startTransition] = useTransition();
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
        defaultValue && setQuery(defaultValue);
    }, [defaultValue])

    const selectedRef = useRef(null);
    const inputRef = useRef(null);


    const sortedData = sortBy ? _.sortBy(data, [sortBy]) : _.sortBy(data);

    const searchedData = useMemo(() => {
        if (query.trim() === "") return sortedData;

        return sortedData.filter((item) =>
            sortBy ? item[sortBy].toLowerCase().includes(query.toLowerCase()) : item.toLowerCase().includes(query.toLowerCase())
        );
    }, [sortedData, query]);

    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        // Start a transition when the query changes
        startTransition(() => {
            setQuery(newQuery);
        });
    };

    const handleOptionSelect = (e, item) => {
        sortBy ? setQuery(item[sortBy]) : setQuery(item);
        setValue(registerName, parseInt(e.target.value));
        setShowDropDown(false);
        //--------------------------------need to handle them by useForm() hook------------------//
    };

    const handleKeyDownSelect = (item, value) => {
        sortBy ? setQuery(item[sortBy]) : setQuery(item);
        setValue(registerName, parseInt(value));
        setShowDropDown(false);
    }

    useEffect(() => {
        setQuery("")
        inputRef.current.value = "";
        setValue(registerName, "");
    }, [reset])

    const handleKeyDown = (e) => {
        if (!showDropDown) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prevIndex) =>
                    prevIndex < searchedData.length - 1 ? prevIndex + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : searchedData.length - 1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex !== -1) {
                    handleKeyDownSelect(searchedData[selectedIndex], searchedData[selectedIndex][value]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setShowDropDown(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (selectedRef.current) {
            selectedRef.current.scrollIntoView({
                block: "nearest",
                inline: "start",
            });
        }
    }, [selectedIndex]);



    return (
        <div className="flex flex-col gap-2 mb-5 relative">
            <label htmlFor={label} className="text-lg font-medium capitalize">
                {label}
            </label>
            <input
                onChange={(e) => handleQueryChange(e)}
                onFocus={() => setShowDropDown(true)}
                onBlur={() => setShowDropDown(false)}
                onKeyDown={handleKeyDown} // Handle keyboard navigation
                id={label}
                type="search"
                value={query}
                ref={inputRef}
                className="border border-gray-200 px-4 py-1 rounded-md focus:ring focus:ring-primary-500/50 focus:outline-none"
                placeholder={`${label}...`}

            />
            {showDropDown && (
                <ul
                    className="w-full bg-white shadow-md rounded-md absolute max-h-48 overflow-y-scroll"
                    style={{ top: "calc(100% + 10px" }}
                >
                    {isSearching ? (
                        <li className="py-1 px-2">Searching...</li>
                    ) : (
                        searchedData.map((item, index) => (
                            <option
                                {...register(registerName)}
                                key={index}
                                ref={selectedIndex === index ? selectedRef : null}
                                className={`cursor-pointer py-1 px-2 hover:bg-gray-100 ${index === selectedIndex ? "bg-gray-100" : ""
                                    }`}
                                onMouseDown={(e) => handleOptionSelect(e, item)}
                                value={value && item[value]}
                            >
                                {sortBy ? item[sortBy] : item}
                            </option>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
