import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader, Send, Sparkles } from 'lucide-react'
import AIFunctions from './AIFunctions'

interface ChatInputProps {
  form: UseFormReturn<{ message: string }, any, undefined>
  onSubmit: (values: { message: string }) => void
  onImportantEvents: () => void
  onMindMap: () => void
  isPending: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({
  form,
  onSubmit,
  onImportantEvents,
  onMindMap,
  isPending
}) => {
  return (
    <footer className='w-full p-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='relative h-full w-full flex flex-col gap-2'
        >
          <div className='absolute flex flex-col gap-2 w-full bottom-0 left-0'>
            <AIFunctions generateMindMap={onMindMap}  importantEvents={onImportantEvents} isPending={isPending} />

            <div className='flex space-x-2 relative'>
              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem className='flex-grow relative'>
                    <FormControl>
                      <Textarea
                        className='backdrop-blur-sm bg-background/70 resize-none textarea'
                        placeholder='Escribe tu mensaje'
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            form.handleSubmit(onSubmit)()
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                size={'icon'}
                variant={'ghost'}
                className='absolute top-1/2 -translate-y-1/2 right-1.5 backdrop-blur-sm bg-background/0 p-2 size-8'
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className='size-4 animate-spin' />
                ) : (
                  <Send className='size-4' />
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </footer>
  )
}

export default ChatInput