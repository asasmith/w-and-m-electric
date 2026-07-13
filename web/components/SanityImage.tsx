import { createImageUrlBuilder } from "@sanity/image-url";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import type { SanityImage as SanityImageType } from "@/lib/sanity/types";

const builder = createImageUrlBuilder(client);

type Props = {
  image: SanityImageType;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
};

export default function SanityImage({
  image,
  width = 800,
  height = 600,
  className = "",
  priority = false,
  sizes,
  fill = false,
}: Props) {
  if (!image?.asset?._id) {
    return null;
  }

  const imageUrl = builder.image(image.asset._id).auto("format").fit("crop").url();

  if (fill) {
    return <Image src={imageUrl} alt={image.alt || ""} fill className={className} priority={priority} sizes={sizes} />;
  }

  return (
    <Image
      src={imageUrl}
      alt={image.alt || ""}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
