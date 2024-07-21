

declare module 'pdfjs-dist/build/pdf.worker.entry' {
    const content: any;
    export default content;
}


declare module '@react-pdf-viewer/page-navigation' {
    export const pageNavigationPlugin: any;
    export interface RenderGoToPageProps {
        onClick: () => void;
        isDisabled: boolean;
    }
}