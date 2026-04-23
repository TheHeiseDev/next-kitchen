"use client"

import { siteConfig } from "@/config/site.config"
import { usePathname } from "next/navigation"
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";


const PageContent = () => {
    const pathname = usePathname()
    const pageContent = siteConfig.pagesContent[pathname as keyof typeof siteConfig.pagesContent];

    const clearHTML = DOMPurify.sanitize(pageContent.content);

    if(!pageContent) {
        return <div>Страница не найдена</div>;
    }

  return (
    <div>{parse(clearHTML)}</div>
  )
}

export default PageContent;