'use client'

import Button from '@/components/Button'
import Link from 'next/link'
import Box from '@/components/Box'
import {MdOutlineStart} from 'react-icons/md'
import Image from 'next/image'
import {useState} from 'react'
import Loader from '@/components/Loader'

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>()

  return isLoading ? (
    <Loader />
  ) : (
    <div className='w-full h-full flex flex-col items-center justify-center p-2'>
      <Box className='w-full sm:w-[75%]'>
        <h1 className='w-[90%] md:w-[75%] text-center text-3xl'>
          Улучшение представлений результатов в сервисе "Мой голос"
        </h1>
        <h2 className='text-center text-2xl font-bold text-emerald-500'>
          SHA-256
        </h2>

        <Link href={'/main'} className='my-6 sm:my-10'>
          <Button
            className='w-[170px] flex items-center justify-center gap-x-3'
            onClick={() => setIsLoading(true)}
          >
            <p className='text-xl'>Старт</p>
            <MdOutlineStart size={25} />
          </Button>
        </Link>
        <div className='w-full flex flex-col gap-y-2 md:flex-row md:gap-x-2 justify-center items-center'>
          <div
            className='
            relative
            h-16
            w-[235px]
            lg:h-20
            lg:w-[310px]
          '
          >
            <Image
              fill
              alt='rosatom'
              className='object-cover'
              src='/images/1.png'
            />
          </div>
          <div
            className='
            relative
            h-16
            w-[235px]
            lg:h-20
            lg:w-[310px]
          '
          >
            <Image
              fill
              alt='rus'
              className='object-cover'
              src='/images/2.png'
            />
          </div>
          <div
            className='
            relative
            h-16
            w-[235px]
            lg:h-20
            lg:w-[310px]
          '
          >
            <Image
              fill
              alt='hack'
              className='object-contain'
              src='/images/3.png'
            />
          </div>
          <div
            className='
            relative
            h-16
            w-[235px]
            lg:h-20
            lg:w-[310px]
          '
          >
            <Image
              fill
              alt='rus'
              className='object-contain'
              src='/images/4.png'
            />
          </div>
        </div>
      </Box>
    </div>
  )
}
