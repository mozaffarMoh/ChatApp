
/* Use Get */
export type UseGet<T> = [
    data: T,
    loading: boolean,
    getData: () => void,
    success: boolean,
    errorMessage: string,
    setData: React.Dispatch<React.SetStateAction<T>>
]


/* Use Input */
export interface DomObjType {
    name: string;
    value: string | number;
}

export interface FormData {
    [key: string]: string | any;
}

export type UseInput = [
    FormData,
    (domObj: DomObjType) => void,
    React.Dispatch<React.SetStateAction<FormData>>
]


/* Use Post */
export type UsePost<T> = [
    () => void,
    boolean,
    boolean,
    string,
    T,
    string,
];


/* Use Put */
export type UsePut = [
    () => void,
    boolean,
    boolean,
    string
];


/* Use Delete */
export type UseDelete = [
    () => void,
    boolean,
    string,
    string
];