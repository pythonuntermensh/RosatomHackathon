'use client'

import Input from '@/components/Input'
import Button from '@/components/Button'
import React, {useState} from 'react'
import toast from 'react-hot-toast'
import {
  useClusterTextBubbleMutation,
  useClusterTextHistMutation,
  useClusterTextScatterMutation,
} from '@/redux/services/ClusterApi'
import {v4 as uuidv4} from 'uuid'
import {AiFillDelete, AiOutlinePlusCircle} from 'react-icons/ai'
import {BsArrowUpRight} from 'react-icons/bs'

interface Answer {
  id: string
  answer: string
}

interface AnswerFormProps {
  setHistData: (data: any) => void
  setScatterData: (data: any) => void
  setBubbleData: (data: any) => void
  setSubmitted: (boolean: boolean) => void
  clusterTextHist: (answers: Answer[]) => any
  clusterTextScatter: (answers: Answer[]) => any
  clusterTextBubble: (answers: Answer[]) => any
  isLoadingViz: boolean
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  setHistData,
  setSubmitted,
  setScatterData,
  setBubbleData,
  clusterTextHist,
  clusterTextBubble,
  clusterTextScatter,
  isLoadingViz
}) => {
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [answers, setAnswers] = useState<Answer[]>([])

  const handleAddAnswer = () => {
    if (currentAnswer.length === 0 || isLoadingViz) {
      return
    }
    setAnswers((prevState) => [
      ...prevState,
      {id: uuidv4(), answer: currentAnswer},
    ])
    setCurrentAnswer('')
  }

  const sendAnswers = async () => {
    if (answers.length > 1 && !isLoadingViz) {
      const dataHist = await clusterTextHist(answers)
      const dataScatter = await clusterTextScatter(answers)
      const dataBubble = await clusterTextBubble(answers)
      setHistData(dataHist)
      setScatterData(dataScatter)
      setBubbleData(dataBubble)
      return setSubmitted(true)
    } else {
      return toast.error('Вы должны добавить больше одного ответа')
    }
  }

  return (
    <>
      <label
        className='self-start text-md'
        htmlFor='name'
        aria-disabled={isLoadingViz}
      >
        Введите ваш ответ:
      </label>
      <Input
        id='name'
        placeholder='Ваш ответ'
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.currentTarget.value)}
        disabled={isLoadingViz}
      />
      <div className='self-end flex flex-col gap-y-3 md:flex-row md:gap-x-3'>
        <Button
          onClick={handleAddAnswer}
          className='self-end flex items-center justify-center gap-x-2 h-12 md:h-12 w-[170px] mb-2'
          disabled={isLoadingViz}
        >
          <p className='font-semibold'>Добавить ответ</p>
          <AiOutlinePlusCircle size={24} />
        </Button>
        <Button
          onClick={sendAnswers}
          className='self-end flex items-center justify-center gap-x-2 bg-emerald-500 border-emerald-500 [box-shadow:0_10px_0_0_#128a62,0_10px_0_0_#128a62] h-12 w-[190px] md:h-12 mb-2'
          disabled={isLoadingViz}
        >
          <p className='font-semibold'>Отправить ответы</p>
          <BsArrowUpRight size={22} />
        </Button>
      </div>

      <div className='flex flex-col gap-y-4 self-start w-full'>
        {answers.map((answer) => {
          return (
            <div
              key={answer.id}
              className='flex flex-col justify-between bg-neutral-100 bg-opacity-30 rounded-xl p-4'
            >
              <p>{answer.answer}</p>
              <button
                className='
                      self-end
                      flex
                      items-center
                      justify-center
                      gap-x-2
                      bg-emerald-500
                      p-3 text-black
                      font-bold
                      rounded-full
                      mt-2
                      hover:cursor-pointer
                      hover:opacity-75
                      transition
                    '
                onClick={() => {
                  const newAnswers = answers.filter((a) => a.id !== answer.id)
                  setAnswers(newAnswers)
                }}
                disabled={isLoadingViz}
              >
                <AiFillDelete size={20} />
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default AnswerForm