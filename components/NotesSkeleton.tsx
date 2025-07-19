import { Skeleton } from "@/components/ui/skeleton"

export function NotesSkeleton() {
    const skeletonCount = 4;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: skeletonCount }).map((_, idx) => (
                <SkeletonCards key={idx} />
            ))}
        </div>
    )
}

export function SkeletonCards() {
    return (
        <div className="flex flex-col space-y-3 w-full">
            <Skeleton className="h-[200px] w-full max-w-xs mx-auto rounded-xl" />
        </div>
    )
}
