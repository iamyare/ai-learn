import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useView } from '@/context/useViewContext';

export const ItemListSkeleton: React.FC = () => {
  const { currentView } = useView();

  const renderSkeletonItems = () => {
    switch (currentView) {
      case 'grid':
      case 'squareGrid':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        );
      case 'detail':
        return (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        );
      case 'verticalGrid':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section>
      <div className="mb-4 flex justify-between items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      {renderSkeletonItems()}
    </section>
  );
};


//Skeleton transcription
export const TranscriptionSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
};