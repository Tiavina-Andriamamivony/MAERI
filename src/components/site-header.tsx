"use client"

import { SearchForm } from "@/components/search-form"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 pl-12 pr-4">
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  )
}
