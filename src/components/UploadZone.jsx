import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { toast } from "react-toastify";
import {
  FiCheckCircle,
  FiImage,
  FiLoader,
  FiStar,
  FiUpload,
} from "react-icons/fi";

function UploadZone() {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const zoneRef = useRef(null);
  const fileInputRef = useRef(null);
  const processingToastRef = useRef(null);
  const apiKey = import.meta.env.VITE_REMOVEBG_API_KEY;

  useEffect(() => {
    if (!file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [file]);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const removeBackground = async (selectedFile) => {
    if (!apiKey) {
      const message = "Missing VITE_REMOVEBG_API_KEY in .env.local";
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setIsProcessing(true);
    processingToastRef.current = toast.loading("Removing background...");

    try {
      const formData = new FormData();
      formData.append("image_file", selectedFile);
      formData.append("size", "auto");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        let message = `remove.bg request failed (${response.status})`;
        try {
          const body = await response.json();
          if (body?.errors?.length) {
            message = body.errors
              .map((item) => item.title || item.detail)
              .filter(Boolean)
              .join(" ");
          }
        } catch {
          // Use generic message.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const nextUrl = URL.createObjectURL(blob);

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(nextUrl);
      toast.update(processingToastRef.current, {
        render: "Background removed successfully",
        type: "success",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
      });
      processingToastRef.current = null;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to remove the background";
      setError(message);

      if (processingToastRef.current) {
        toast.update(processingToastRef.current, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 4000,
          closeOnClick: true,
        });
        processingToastRef.current = null;
      } else {
        toast.error(message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.warning("Please choose a valid image file");
      return;
    }

    setFile(selectedFile);
    setResultUrl(null);
    setError(null);
    removeBackground(selectedFile);
  };

  useEffect(() => {
    gsap.fromTo(
      zoneRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2 },
    );
  }, []);

  return (
    <div
      ref={zoneRef}
      className={`cursor-pointer rounded-[20px] border-2 border-dashed px-8 py-12 text-center transition ${
        drag
          ? "border-violet-500/90 bg-violet-500/15"
          : "border-violet-500/40 bg-[rgba(18,15,40,.5)] hover:border-violet-500/85 hover:bg-indigo-500/10"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDrag(false);
        handleFile(event.dataTransfer.files[0]);
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        data-upload-input="true"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files[0])}
      />

      {file ? (
        <div className="grid gap-5">
          <div>
            <div className="mb-2.5 flex justify-center text-[40px] text-violet-300">
              {isProcessing ? (
                <FiLoader className="animate-spin" />
              ) : resultUrl ? (
                <FiCheckCircle />
              ) : (
                <FiImage />
              )}
            </div>
            <p className="font-medium text-violet-300">{file.name}</p>
            <p className="mt-1 text-xs text-[#8B85A8]">
              {isProcessing
                ? "Removing background now..."
                : resultUrl
                  ? "Processed and ready to download"
                  : "Click to change image"}
            </p>
          </div>

          <div
            className={`grid gap-3 ${resultUrl ? "md:grid-cols-2" : "grid-cols-1"}`}
          >
            <div className="rounded-[18px] border border-violet-500/25 bg-[rgba(18,15,40,.72)] p-3.5 backdrop-blur-xl">
              <div className="mb-2.5 text-xs text-[#8B85A8]">Original</div>
              <img
                src={previewUrl ?? undefined}
                alt="Original upload preview"
                className="aspect-[4/3] w-full rounded-[14px] object-cover"
              />
            </div>

            {resultUrl && (
              <div className="rounded-[18px] border border-violet-500/25 bg-[rgba(18,15,40,.72)] p-3.5 backdrop-blur-xl">
                <div className="mb-2.5 text-xs text-[#8B85A8]">
                  Removed background
                </div>
                <img
                  src={resultUrl}
                  alt="Background removed preview"
                  className="aspect-[4/3] w-full rounded-[14px] object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              className="rounded-full border border-violet-500/25 px-[18px] py-3 text-sm font-medium text-[#8B85A8] transition hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-[#F0EEFF]"
              onClick={(event) => {
                event.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Change image
            </button>

            {resultUrl && (
              <a
                href={resultUrl}
                download={`${file.name.replace(/\.[^.]+$/, "")}-no-bg.png`}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 px-[18px] py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(124,58,237,.55)]"
              >
                Download PNG
              </a>
            )}
          </div>

          {error && (
            <div className="text-sm leading-6 text-rose-300">{error}</div>
          )}

          {isProcessing && (
            <div className="text-xs text-[#8B85A8]">
              Working with remove.bg. This can take a few seconds.
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="relative mb-4 inline-block">
            <div className="absolute -inset-2.5 animate-ping rounded-full border-2 border-violet-500/40" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-violet-500/35 bg-gradient-to-br from-violet-600/20 to-blue-600/20 text-3xl">
              <FiUpload />
            </div>
          </div>
          <p className="mb-2 font-syne text-lg font-bold text-[#F0EEFF]">
            Drop your image here
          </p>
          <p className="mb-4 text-sm text-[#8B85A8]">
            PNG, JPG, WEBP · up to 20MB
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["AI-Powered", "HD Quality", "Instant"].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-600/15 px-3.5 py-1.5 text-xs text-violet-300"
              >
                <FiStar className="h-3 w-3" /> {label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default UploadZone;
