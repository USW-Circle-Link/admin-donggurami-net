import { useState } from 'react';
import { toast } from 'sonner';
import { Map, Upload, RotateCcw } from 'lucide-react';
import { useFloorMap, useUploadFloorMaps, useDeleteFloorMap } from '@/features/floor-maps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FloorType = 'B1' | 'F1' | 'F2';

export default function FloorMapsManagePage() {
  const [selectedFloor, setSelectedFloor] = useState<FloorType>('B1');

  // Queries for each floor
  const { data: b1Data } = useFloorMap({ floor: 'B1' });
  const { data: f1Data } = useFloorMap({ floor: 'F1' });
  const { data: f2Data } = useFloorMap({ floor: 'F2' });

  // Mutations
  const uploadMutation = useUploadFloorMaps();
  const deleteMutation = useDeleteFloorMap();

  const floorData: Record<FloorType, typeof b1Data> = {
    B1: b1Data,
    F1: f1Data,
    F2: f2Data,
  };


  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      const uploadData: Record<string, File> = {};
      uploadData[selectedFloor] = file;
      await uploadMutation.mutateAsync(uploadData);
      toast.success('안내도가 업로드되었습니다.');
      // Reset file input
      event.target.value = '';
    } catch (error) {
      toast.error('업로드에 실패했습니다.');
      console.error('Upload error:', error);
    }
  };

  const handleReset = async (floor: FloorType) => {
    const confirmed = window.confirm('안내도를 재설정하시겠습니까? 기존 이미지가 삭제되고 새로 업로드할 수 있습니다.');
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(floor);
      toast.success('안내도가 재설정되었습니다. 새 이미지를 업로드해주세요.');
    } catch (error) {
      toast.error('재설정에 실패했습니다.');
      console.error('Reset error:', error);
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = '/circle_default_image.png';
  };

  const floorLabels: Record<FloorType, string> = {
    B1: 'B1층',
    F1: '1층',
    F2: '2층',
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Map className="w-6 h-6" />
          층별 안내도 관리
        </h1>
        <p className="text-muted-foreground mt-1">각 층의 안내도 사진을 업로드하세요</p>
      </div>

      <Tabs value={selectedFloor} onValueChange={(value) => setSelectedFloor(value as FloorType)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="B1">B1층</TabsTrigger>
          <TabsTrigger value="F1">1층</TabsTrigger>
          <TabsTrigger value="F2">2층</TabsTrigger>
        </TabsList>

        {(['B1', 'F1', 'F2'] as FloorType[]).map((floor) => (
          <TabsContent key={floor} value={floor} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{floorLabels[floor]} 안내도</CardTitle>
                <CardDescription>
                  {floorData[floor] ? '현재 등록된 안내도' : '아직 등록된 안내도가 없습니다'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {floorData[floor]?.data ? (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={floorData[floor]!.data.presignedUrl}
                        alt={`${floorLabels[floor]} 안내도`}
                        className="w-full h-auto max-h-[600px] object-contain"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <label htmlFor={`file-reupload-${floor}`} className="cursor-pointer">
                        <Button
                          disabled={uploadMutation.isPending}
                          variant="outline"
                          className="gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(`file-reupload-${floor}`)?.click();
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          이미지 변경
                        </Button>
                      </label>
                      <input
                        id={`file-reupload-${floor}`}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploadMutation.isPending}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleReset(floor)}
                        disabled={deleteMutation.isPending}
                        className="gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        재설정
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">안내도 이미지를 업로드하세요</p>
                    <label htmlFor={`file-upload-${floor}`} className="cursor-pointer">
                      <div className="inline-block">
                        <Button
                          disabled={uploadMutation.isPending}
                          className="gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(`file-upload-${floor}`)?.click();
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          파일 선택
                        </Button>
                      </div>
                    </label>
                    <input
                      id={`file-upload-${floor}`}
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      disabled={uploadMutation.isPending}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      이미지 파일 (최대 5MB)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
