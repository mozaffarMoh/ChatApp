import React from "react";
import { DomObjType, FormData, UseInput } from "../Types/CustomHooks";


const useInput = (): UseInput => {
    const [formData, setFormData] = React.useState<FormData>({});

    const handleChange = (domObj: DomObjType) => {
        const { name, value } = domObj;
        setFormData((prev: FormData) => {
            return { ...prev, [name]: value };
        });
    };

    return [formData, handleChange, setFormData];
};

export default useInput;
