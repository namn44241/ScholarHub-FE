import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export const MatchingSkeleton = () => {
  return (
    <div className="flex md:flex-row flex-col gap-8">

      <div className="space-y-6 w-full md:w-5/12">
        <Card className="shadow-md border-muted-foreground/20">
          <CardHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="font-bold text-2xl">Match Overview</CardTitle>
              <Skeleton className="rounded-full w-32 h-8" />
            </div>
            <Skeleton className="mt-2 w-full h-4" />
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="mb-2 w-full h-4" />
            <Skeleton className="mb-4 w-3/4 h-4" />
            <Skeleton className="rounded-md w-full h-10" />
          </CardContent>
        </Card>

        <Tabs defaultValue="scholarship" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="scholarship">Scholarship</TabsTrigger>
            <TabsTrigger value="profile">Your Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="scholarship" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="mt-2 w-1/2 h-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-3/4 h-4" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="rounded-full w-20 h-8" />
                    <Skeleton className="rounded-full w-20 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="w-1/4 h-5" />
                    <Skeleton className="w-full h-10" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="w-1/4 h-5" />
                    <Skeleton className="w-full h-10" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="w-1/4 h-5" />
                    <Skeleton className="w-full h-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full md:w-7/12">
        <Card className="shadow-md mb-6 border-muted-foreground/20">
          <CardHeader className="border-b">
            <CardTitle><Skeleton className="w-40 h-6" /></CardTitle>
            <Skeleton className="mt-1 w-3/4 h-4" />
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-6 h-[350px]">
            <div className="flex justify-center items-center w-full h-full">
              <div className="relative w-[300px] h-[300px]">

                <div className="absolute inset-0 opacity-20 border border-gray-200 rounded-full"></div>
                <div className="absolute inset-[15%] opacity-30 border border-gray-200 rounded-full"></div>
                <div className="absolute inset-[30%] opacity-40 border border-gray-200 rounded-full"></div>
                <div className="absolute inset-[45%] opacity-50 border border-gray-200 rounded-full"></div>
                <div className="absolute inset-[60%] opacity-60 border border-gray-200 rounded-full"></div>
                <div className="absolute inset-[75%] opacity-70 border border-gray-200 rounded-full"></div>
                
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <div 
                    key={i}
                    className="top-1/2 left-1/2 absolute bg-gray-200 opacity-40 w-[1px] h-[150px] origin-bottom"
                    style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
                  ></div>
                ))}
                
                {[45, 90, 135, 180, 225, 270, 315, 360].map((angle, i) => (
                  <Skeleton 
                    key={i}
                    className="absolute rounded-full w-3 h-3"
                    style={{ 
                      top: `${50 - 40 * Math.sin(angle * Math.PI / 180)}%`,
                      left: `${50 + 40 * Math.cos(angle * Math.PI / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-muted-foreground/20">
          <CardHeader className="border-b">
            <CardTitle><Skeleton className="w-64 h-6" /></CardTitle>
            <Skeleton className="mt-1 w-full h-4" />
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 bg-card p-4 border border-muted-foreground/20 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Skeleton className="rounded-full size-4" />
                    <Skeleton className="w-32 h-5" />
                  </div>
                  <Skeleton className="rounded-full w-16 h-6" />
                </div>

                <Skeleton className="rounded-full w-full h-2" />

                <div className="flex items-start gap-2 pt-1">
                  <Skeleton className="flex-shrink-0 rounded-full size-4" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
