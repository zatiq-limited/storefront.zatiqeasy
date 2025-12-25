"use client";

import React, { useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface ImageLightboxProps {
  product: {
    images?: string[];
    name: string;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedImageIdx?: number;
}

export const ImageLightbox = ({
  product,
  open,
  setOpen,
  selectedImageIdx,
}: ImageLightboxProps) => {
  // Generate slides for the lightbox
  const slides = useMemo(() => {
    return product?.images?.map((img: string) => ({
      src: img,
      width: 3840,
      height: 2560,
      srcSet: [
        { src: img, width: 320, height: 213 },
        { src: img, width: 640, height: 426 },
        { src: img, width: 1200, height: 800 },
        { src: img, width: 2048, height: 1365 },
        { src: img, width: 3840, height: 2560 },
      ],
    }));
  }, [product]);

  return (
    slides && (
      <div
        onContextMenu={(e) => e.preventDefault()} // Disable right-click
        style={{ userSelect: "none" }} // Disable text/image selection
      >
        <Lightbox
          className="p-0 m-0"
          open={open}
          close={() => setOpen(false)}
          plugins={[Zoom]}
          index={selectedImageIdx}
          slides={slides}
        />
      </div>
    )
  );
};
