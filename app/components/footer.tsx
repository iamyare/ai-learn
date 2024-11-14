/* eslint-disable @next/next/no-img-element */
'use client'

import { Separator } from '@/components/ui/separator'
import { GithubIcon, InstagramIcon, LinkedinIcon } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-background my-4'>
      <div className='w-full container'>
        <div className='flex justify-between'>
          <Link
            href='https://sticky-notes-yare.vercel.app/'
            className='flex items-center  space-x-3 rtl:space-x-reverse'
          >
            <img
              src='/stick_note_logo.webp'
              className='h-8 object-cover'
              alt='Stick Note Logo'
            />
            <p className='self-center text-2xl sout-gummy text-primary whitespace-nowrap '>
              Stick Note
            </p>
          </Link>
          <ul className='flex flex-wrap items-center gap-4 text-muted-foreground'>
            <li>
              <Link href={'https://github.com/iamyare'} target='_blank'>
                <GithubIcon className='size-5' />
              </Link>
            </li>

            <li>
              <Link
                href={'https://www.linkedin.com/in/iamyare/'}
                target='_blank'
              >
                <LinkedinIcon className='size-5' />
              </Link>
            </li>

            <li>
              <Link
                href={'https://www.instagram.com/i.am.yare/'}
                target='_blank'
              >
                <InstagramIcon className='size-5' />
              </Link>
            </li>
          </ul>
        </div>
        <Separator className=' my-2' />
        <span className='block text-sm text-muted-foreground sm:text-center '>
          © 2024{' '}
          <Link href='#' className='hover:underline'>
            Stick Note
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}
