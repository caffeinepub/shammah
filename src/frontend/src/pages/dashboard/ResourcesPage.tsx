import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, Download, ExternalLink, Play } from 'lucide-react';

const mockVideos = [
  {
    id: 1,
    title: 'Understanding SCINS: A Comprehensive Guide',
    description: 'Learn about stigmatizing health conditions and how to manage them effectively.',
    duration: '15:30',
    thumbnail: '/assets/generated/video-thumbnail.dim_300x200.png',
  },
  {
    id: 2,
    title: 'Mindfulness Techniques for Emotional Wellness',
    description: 'Practical mindfulness exercises to improve your emotional resilience.',
    duration: '12:45',
    thumbnail: '/assets/generated/video-thumbnail.dim_300x200.png',
  },
  {
    id: 3,
    title: 'Building Social Connections',
    description: 'Strategies for maintaining healthy relationships while managing health conditions.',
    duration: '18:20',
    thumbnail: '/assets/generated/video-thumbnail.dim_300x200.png',
  },
];

const mockEbooks = [
  {
    id: 1,
    title: 'The Complete Guide to Holistic Wellness',
    author: 'Dr. Sarah Johnson',
    pages: 245,
    description: 'A comprehensive resource covering all seven pillars of wellness.',
    cover: '/assets/generated/ebook-cover.dim_200x300.png',
  },
  {
    id: 2,
    title: 'Living Well with SCINS',
    author: 'Michael Chen, PhD',
    pages: 180,
    description: 'Practical advice and personal stories from those managing stigmatizing conditions.',
    cover: '/assets/generated/ebook-cover.dim_200x300.png',
  },
  {
    id: 3,
    title: 'Psychodermatology Essentials',
    author: 'Dr. Emily Rodriguez',
    pages: 320,
    description: 'Understanding the mind-skin connection and its impact on wellness.',
    cover: '/assets/generated/ebook-cover.dim_200x300.png',
  },
];

const mockGuides = [
  {
    id: 1,
    title: 'Daily Wellness Routine Guide',
    description: 'Step-by-step guide to creating and maintaining a personalized wellness routine.',
    type: 'PDF',
    size: '2.4 MB',
  },
  {
    id: 2,
    title: 'Nutrition Planning for Skin Health',
    description: 'Evidence-based nutritional strategies to support skin healing and overall health.',
    type: 'PDF',
    size: '1.8 MB',
  },
  {
    id: 3,
    title: 'Stress Management Workbook',
    description: 'Interactive exercises and worksheets for managing stress and anxiety.',
    type: 'PDF',
    size: '3.2 MB',
  },
  {
    id: 4,
    title: 'Financial Wellness Toolkit',
    description: 'Resources for managing healthcare costs and accessing affordable care.',
    type: 'PDF',
    size: '1.5 MB',
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Resources</h1>
        <p className="text-gray-600">
          Access self-help materials, educational content, and wellness guides to support your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{mockVideos.length}</p>
                <p className="text-sm text-gray-600">Video Tutorials</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{mockEbooks.length}</p>
                <p className="text-sm text-gray-600">eBooks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{mockGuides.length}</p>
                <p className="text-sm text-gray-600">Guides & Workbooks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-emerald-50">
          <TabsTrigger value="videos" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <Video className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="ebooks" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            eBooks
          </TabsTrigger>
          <TabsTrigger value="guides" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Guides
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVideos.map((video) => (
              <Card key={video.id} className="border-emerald-200 hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-t-lg">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-emerald-600 ml-1" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                    {video.duration}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ebooks" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEbooks.map((ebook) => (
              <Card key={ebook.id} className="border-emerald-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-center pt-6">
                  <img 
                    src={ebook.cover} 
                    alt={ebook.title}
                    className="h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800">{ebook.title}</CardTitle>
                  <CardDescription>
                    <p className="font-medium text-gray-700">{ebook.author}</p>
                    <p className="text-sm text-gray-500">{ebook.pages} pages</p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{ebook.description}</p>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read
                    </Button>
                    <Button variant="outline" className="border-emerald-200">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockGuides.map((guide) => (
              <Card key={guide.id} className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-emerald-800 mb-2">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-lg ml-4">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                        {guide.type}
                      </Badge>
                      <span>{guide.size}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-emerald-200">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="text-emerald-800">Need More Resources?</CardTitle>
          <CardDescription>
            We're constantly adding new content to support your wellness journey. Check back regularly for updates!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Have a suggestion for resources you'd like to see? Let us know through the feedback form.
          </p>
          <Button variant="outline" className="border-emerald-300 hover:bg-emerald-50">
            <ExternalLink className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
