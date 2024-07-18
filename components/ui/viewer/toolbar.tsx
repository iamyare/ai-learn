'use client'

import { RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

interface ToolbarProps {
    toolbarButtonProps: {
        GoToFirstPage: any;
        GoToLastPage: any;
        GoToNextPage: any;
        GoToPreviousPage: any;
        NumberOfPages: any;
        CurrentPageInput: any;
    }
}

export default function Toolbar({ toolbarButtonProps }: ToolbarProps) {
    const { GoToFirstPage, GoToLastPage, GoToNextPage, GoToPreviousPage, NumberOfPages, CurrentPageInput } = toolbarButtonProps;

  return (
    <div className=" absolute top-2 left-1/2 -translate-x-1/2 flex gap-2 w-fit bg-muted/90 border backdrop-blur-sm mx-auto rounded-full items-center justify-center px-4 py-2 ">

          <GoToFirstPage>
              {(props: RenderGoToPageProps) => (
                  <Button
                      variant={'ghost'}
                      onClick={props.onClick}
                      size={'icon'}
                  >
                      <ChevronFirst  className=' size-5' />
                  </Button>
              )}
          </GoToFirstPage>

            <GoToPreviousPage>
                {(props: RenderGoToPageProps) => (
                    <Button
                        variant={'ghost'}
                        onClick={props.onClick}
                        size={'icon'}
                    >
                        <ChevronLeft className=' size-5' />
                    </Button>
                )}
            </GoToPreviousPage>
        <div className="px-1 flex items-center gap-2">
            <CurrentPageInput />
            <NumberOfPages />
        </div>
        <GoToNextPage>
            {(props: RenderGoToPageProps) => (
                <Button
                    variant={'ghost'}
                    onClick={props.onClick}
                    size={'icon'}
                >
                    <ChevronRight className=' size-5' />

                </Button>
            )}
        </GoToNextPage>
        <GoToLastPage>
            {(props: RenderGoToPageProps) => (
                <Button
                    variant={'ghost'}
                    onClick={props.onClick}
                    size={'icon'}
                >
                    <ChevronLast className=' size-5' />

                </Button>
            )}
        </GoToLastPage>
    </div>
  );
}