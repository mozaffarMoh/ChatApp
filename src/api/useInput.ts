import React from "react";

interface DomObjType {
    name: string;
    value: string | number;
}

const useInput = () => {
    const [formData, setFormData] = React.useState({});

    const handleCahnge = (domObj: DomObjType) => {
        const { name, value } = domObj;
        setFormData((prev) => {
            return { ...prev, [name]: value };
        });
    };
    return [formData, handleCahnge];
};

export default useInput;
