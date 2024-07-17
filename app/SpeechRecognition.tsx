import CoursorText from '@/components/ui/coursor-text'
import { useSpeechRecognition } from '@/components/ui/useSpeechRecognition'

const SpeechRecognition: React.FC = () => {
  const { isListening, transcript, history, startListening, stopListening } = useSpeechRecognition()

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Reconocimiento de Voz</h1>
      <div className='flex space-x-2 mb-4'>
        <button
          className={`px-4 py-2 rounded ${
            isListening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? 'Detener' : 'Iniciar'} Reconocimiento
        </button>
      </div>
      <div className='mt-4'>
        <h2 className='text-xl font-semibold'>Transcripción en tiempo real:</h2>
        <p className='mt-2 p-2 bg-gray-100 rounded'>{transcript}</p>
      </div>
      <div className='mt-4'>
        <h2 className='text-xl font-semibold'>Historial:</h2>
        <div className='mt-2 p-2 flex flex-col gap-2  rounded whitespace-pre-wrap bg-black'>
          {history.length !== 0 ? (
            <>
              {history.map((entry, index) => (
                <p key={index} className='text-background'>
                  <span className=' ml-2 text-muted-foreground text-sm'>
                    {entry.timestamp}
                    {'\n'}
                  </span>
                  {entry.text}
                  {
                    //si es la última entrada, anexar puntos suspensivos
                    index === history.length - 1
                      ? isListening && (
                          <span>
                            {' '}{transcript}<CoursorText />
                          </span>
                        )
                      : null
                  }
                  {/* {index < history.length - 1 ? '\n' : ''} */}
                </p>
              ))}
            </>
          ) : (
            isListening && (
              <span>
                {transcript}<CoursorText />
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default SpeechRecognition
