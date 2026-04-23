"use client"

import React from "react";

interface IProps {
    children: React.ReactNode
}
const IngridientsLayout = ({children}: IProps) => {
    return <section>{children}</section>;
}
 
export default IngridientsLayout;