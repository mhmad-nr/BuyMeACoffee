import { ComponentType, ElementType } from "react";

export type Props = {
    Component: ComponentType | ElementType
};
export type PropsWithChildren = {
    children: ComponentType | ElementType
};
export type TypeSize = "small" | "normal" | "big"

// Components
export type TypeBTNProps = {
    text: string,
    component?: ComponentType,
    color: string,
    disable: boolean,
    type: 'colored' | 'default',
    buttonStyle: TypeSize | "full",
    buttonText: "white" | "Black",
    onClick: () => void
}

// type ButtonDefault = {
//     type: 'default',
//     buttonText: "Black",
// }
// type ButtonColored = {
//     type: 'colored',
//     buttonText: "white",
//     color: string,
// }

export type Typestate<T> = {
    fullName: string,
    img: T,
    discription: string

}

// export type walletType = {
//     address: string,
//     selected: boolean
// }



export type ResponseType<T> = ResponseTypeSuccess<T> | ResponseTypeFail
type ResponseTypeSuccess<T> = {
    success: true,
    data: T
}
type ResponseTypeFail = {
    success: false,
    massage: string
}
export enum stageType {
    STAGE_ONE,
    STAGE_TWO,
    STAGE_FIRST_ERROR,
    STAGE_SECOND_ERROR,
    STAGE_HIDE,
    STAGE_LOADING,

}
