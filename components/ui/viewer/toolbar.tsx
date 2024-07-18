'use client'

import React, { ReactElement } from 'react';
import { ToolbarSlot } from '@react-pdf-viewer/toolbar';
import { RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
import { RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import { RenderEnterFullScreenProps } from '@react-pdf-viewer/full-screen';
import { RenderDownloadProps } from '@react-pdf-viewer/get-file';
import { RenderPrintProps } from '@react-pdf-viewer/print';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Printer, Maximize, ZoomInIcon, ZoomOutIcon, DownloadIcon, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
    toolbarSlot: ToolbarSlot;
    className?: string;
}

type RenderProps = RenderZoomInProps | RenderZoomOutProps | RenderGoToPageProps | RenderEnterFullScreenProps | RenderDownloadProps | RenderPrintProps;

function ToolbarButton<T extends RenderProps>({ 
    tooltip, 
    icon: Icon,
    render 
}: { 
    tooltip: string; 
    icon: LucideIcon;
    render: (renderButton: (onClick: () => void) => ReactElement) => ReactElement 
}) {
    return (
        <Tooltip delayDuration={500}>
            <TooltipTrigger>
                {render((onClick) => (
                    <Button variant="ghost" size="icon" onClick={onClick}>
                        <Icon className="size-4" />
                    </Button>
                ))}
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default function Toolbar({ toolbarSlot, className }: ToolbarProps) {
    const {
        CurrentPageInput,
        Download,
        EnterFullScreen,
        GoToNextPage,
        GoToPreviousPage,
        NumberOfPages,
        Print,
        ZoomIn,
        ZoomOut,
    } = toolbarSlot;

    return (
        <TooltipProvider>
            <div className={cn("flex gap-2 w-fit bg-muted/90 border backdrop-blur-sm mx-auto rounded-full items-center justify-center px-4 py-2", className)}>
                <ToolbarButton<RenderZoomOutProps>
                    tooltip="Zoom Out"
                    icon={ZoomOutIcon}
                    render={(renderButton) => (
                        <ZoomOut>
                            {(props: RenderZoomOutProps) => renderButton(props.onClick)}
                        </ZoomOut>
                    )}
                />

                <ToolbarButton<RenderZoomInProps>
                    tooltip="Zoom In"
                    icon={ZoomInIcon}
                    render={(renderButton) => (
                        <ZoomIn>
                            {(props: RenderZoomInProps) => renderButton(props.onClick)}
                        </ZoomIn>
                    )}
                />

                <div className="px-1 flex items-center gap-2">
                    <ToolbarButton<RenderGoToPageProps>
                        tooltip="Previous Page"
                        icon={ChevronLeft}
                        render={(renderButton) => (
                            <GoToPreviousPage>
                                {(props: RenderGoToPageProps) => renderButton(props.onClick)}
                            </GoToPreviousPage>
                        )}
                    />

                    <CurrentPageInput />
                    <span>/</span>
                    <NumberOfPages />

                    <ToolbarButton<RenderGoToPageProps>
                        tooltip="Next Page"
                        icon={ChevronRight}
                        render={(renderButton) => (
                            <GoToNextPage>
                                {(props: RenderGoToPageProps) => renderButton(props.onClick)}
                            </GoToNextPage>
                        )}
                    />
                </div>

                <ToolbarButton<RenderEnterFullScreenProps>
                    tooltip="Full Screen"
                    icon={Maximize}
                    render={(renderButton) => (
                        <EnterFullScreen>
                            {(props: RenderEnterFullScreenProps) => renderButton(props.onClick)}
                        </EnterFullScreen>
                    )}
                />

                <ToolbarButton<RenderDownloadProps>
                    tooltip="Download"
                    icon={DownloadIcon}
                    render={(renderButton) => (
                        <Download>
                            {(props: RenderDownloadProps) => renderButton(props.onClick)}
                        </Download>
                    )}
                />

                <ToolbarButton<RenderPrintProps>
                    tooltip="Print"
                    icon={Printer}
                    render={(renderButton) => (
                        <Print>
                            {(props: RenderPrintProps) => renderButton(props.onClick)}
                        </Print>
                    )}
                />
            </div>
        </TooltipProvider>
    );
}