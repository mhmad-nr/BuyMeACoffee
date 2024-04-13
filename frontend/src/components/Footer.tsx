import React from 'react'
import { ReactComponent as GITHUB } from '../assets/icons/github-icon.svg'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <div>
      <div className='mx-auto lg_w-[1128px] py-4 flex justify-between items-center'>
        <a target='_blank' href='https://github.com/mhmad-nr/ByMeACoffee_frontEnd'>
          <GITHUB />
        </a>
        <div className="font-cr-regular text-base font-light flex items-center md:mt-12" data-v-257b648c="">© Buy Me a
          Coffee by <span className='ml-1 font-normal'>mhmad-nr</span>
        </div>
      </div>
    </div>
  )
}

