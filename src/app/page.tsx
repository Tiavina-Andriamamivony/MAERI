import React from 'react'
import { NavbarDemo } from '@/components/navbar'
import { InteractiveGridPatternDemo } from '@/components/background-box'
import { ScrollProgress } from '@/components/magicui/scroll-progress'
import { Services } from '@/components/SeviceSection'

export default function Home() {
  return (
    <div className='w-fit h-fit box-border m-0 p-0 ' >
      <InteractiveGridPatternDemo/>
    </div>
  )
}
