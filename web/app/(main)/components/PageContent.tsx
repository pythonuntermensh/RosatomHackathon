'use client'

import Box from '@/components/Box'
import Button from '@/components/Button'
import {AiOutlineArrowLeft} from 'react-icons/ai'
import {useRouter} from 'next/navigation'
import {BsFiletypeJson} from 'react-icons/bs'
import {useState} from 'react'
import toast from 'react-hot-toast'
import ScatterVisualization from '@/components/ScatterVisualization'
import BubbleVisualization from '@/components/BubbleVisualization'
import HistogramVisualization from '@/components/HistogramVisualization'
import AnswerForm from '@/components/AnswerForm'
import {
  useClusterFileMutation, useClusterTextBubbleMutation,
  useClusterTextHistMutation,
  useClusterTextScatterMutation
} from "@/redux/services/ClusterApi";
import Loader from "@/components/Loader";

export const revalidate = 0

const PageContent = () => {
  const router = useRouter()

  const [clusterTextHist, {isLoading: histIsLoading}] = useClusterTextHistMutation()
  const [clusterTextScatter, {isLoading: scatterIsLoading}] = useClusterTextScatterMutation()
  const [clusterTextBubble, {isLoading: bubbleIsLoading}] = useClusterTextBubbleMutation()

  const isLoadingViz = histIsLoading || scatterIsLoading || bubbleIsLoading

  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [histData, setHistData] = useState()
  const [scatterData, setScatterData] = useState()
  const [bubbleData, setBubbleData] = useState()
  const [fileData, setFileData] = useState()
  const [clusterFile, {isLoading}] = useClusterFileMutation()

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        toast.error('Вы должны прикрепить файл')
      }

      const file = event.target?.files[0]
      const formData = new FormData();
      formData.append('fileInput', file);
      const fileObj = await clusterFile(formData)
      setFileData(fileObj)

    } catch (error) {
      toast.error('Ошибка при загрузке файла')
    } finally {
      setSubmitted(true)
      setUploading(false)
    }
  }

  if (isLoading || histIsLoading || scatterIsLoading || bubbleIsLoading) {
    return <Loader />
  }

  return !submitted ? (
    <div className='w-full flex items-center justify-center p-2'>
      <div className='flex flex-col gap-y-6 w-full md:w-[75%]'>
        <Button
          onClick={() => router.back()}
          className='self-start w-[150px] flex gap-x-2 items-center justify-center'
        >
          <AiOutlineArrowLeft size={22} />
          <p className='text-lg'>Назад</p>
        </Button>
        <Box className='pb-4'>
          <form method="post" encType="multipart/form-data">
            <label
              htmlFor='single'
              className='flex flex-col items-center justify-center gap-y-2'
            >
              <BsFiletypeJson size={70} />
              <div className='flex items-center justify-center gap-x-2 bg-emerald-500 p-3 text-black font-bold rounded-full mt-2 hover:cursor-pointer hover:opacity-75 transition'>
                <p>Загрузите ваш .json файл</p>
              </div>
            </label>

            <input
              onChange={uploadFile}
              className='hidden'
              type='file'
              id='single'
              accept='.json'
              disabled={uploading}
            />
          </form>


          <p className='py-4 text-xl'>Или...</p>

          <AnswerForm
            setHistData={setHistData}
            setSubmitted={setSubmitted}
            setScatterData={setScatterData}
            setBubbleData={setBubbleData}
            clusterTextHist={clusterTextHist}
            clusterTextScatter={clusterTextScatter}
            clusterTextBubble={clusterTextBubble}
            isLoadingViz={isLoadingViz}
          />
        </Box>
      </div>
    </div>
  ) : (
    <div className='flex w-full justify-center p-2'>
      <div className='flex flex-col gap-y-4 w-full md:w-[75%]'>
        <Button
          onClick={() => {
            setSubmitted(false)
            setFileData(null)
          }}
          className='self-start w-[150px] flex gap-x-2 mb-2 items-center justify-center'
        >
          <AiOutlineArrowLeft size={22} />
          <p className='text-lg'>Назад</p>
        </Button>
        {
          fileData ? (
            <>
              <div className='w-full'>
                <ScatterVisualization chartData={fileData.data['points']} />
              </div>

              <div className='w-full'>
                <BubbleVisualization chartData={fileData.data['bubbles']} />
              </div>

              <div className='w-full'>
                <HistogramVisualization chartData={fileData.data['hist']} />
              </div>
            </>
          ) : (
            <>
              <div className='w-full'>
                <ScatterVisualization chartData={scatterData.data} />
              </div>

              <div className='w-full'>
                <BubbleVisualization chartData={bubbleData.data} />
              </div>

              <div className='w-full'>
                <HistogramVisualization chartData={histData.data} />
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

export default PageContent
