import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Camera, CameraOff, RefreshCcw, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  onCaptured: (file: File, dataUrl: string) => void;
  onClose: () => void;
};

const CameraCapture = ({ onCaptured, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [facingUser, setFacingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingUser ? "user" : "environment" },
        audio: false,
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.onloadedmetadata = () => setReady(true);
        await videoRef.current.play().catch(() => {});
      }
    } catch (e) {
      setError("Camera access denied or unavailable.");
    }
  };

  const stop = () => {
    setReady(false);
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  };

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingUser]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !ready || !video.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        const finalize = (b: Blob) => {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          const file = new File([b], "captured-photo.jpg", { type: "image/jpeg" });
          onCaptured(file, dataUrl);
          stop();
          onClose();
        };
        if (blob) finalize(blob);
        else {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          const byteString = atob(dataUrl.split(",")[1]);
          const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
          finalize(new Blob([ab], { type: mimeString }));
        }
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <Card className="glass-card border-glass-border p-3 w-full max-w-md">
      <CardContent className="space-y-3">
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video ref={videoRef} className="w-full h-auto" />
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={facingUser}
              onCheckedChange={(v) => setFacingUser(!!v)}
              id="facing"
            />
            <label htmlFor="facing" className="text-sm">Front Camera</label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={start} title="Restart">
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={stop} title="Stop">
              <CameraOff className="h-4 w-4" />
            </Button>
            <Button onClick={capture} disabled={!ready} className="btn-hero">
              <Camera className="h-4 w-4 mr-2" /> Capture
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <RotateCcw className="h-3 w-3" />
          If the preview is blank, tap Restart, then Capture.
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;


