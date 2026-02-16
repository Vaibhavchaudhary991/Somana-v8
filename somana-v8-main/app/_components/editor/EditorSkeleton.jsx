export default function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Toolbar skeleton */}
      <div className="flex gap-2 p-2 border rounded-md bg-muted/50">
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-px bg-border" />
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-px bg-border" />
        <div className="h-8 w-20 bg-muted rounded" />
        <div className="h-8 w-20 bg-muted rounded" />
      </div>

      {/* Editor content skeleton */}
      <div className="border rounded-md p-4 min-h-[400px] bg-background">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-8 bg-muted/50 rounded my-4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-4/5" />
          <div className="h-4 bg-muted rounded w-full" />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center text-sm text-muted-foreground">
        Loading editor...
      </div>
    </div>
  );
}
