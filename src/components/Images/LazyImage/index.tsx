// base
import React, { useCallback, useEffect, useState } from 'react';

// consts
import { placeholder } from 'consts';

// libraries
import ProgressiveImage from 'react-progressive-graceful-image';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  isCircle?: boolean;
  isUserFileId?: boolean;
  thumbId?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = '',
  width = '100%',
  height = '100%',
  isCircle = false,
  isUserFileId,
  thumbId,
  ...props
}) => {
  const [isImage, setIsImage] = useState('');

  // const getThumb = useCallback(async () => {
  //   if (!isUserFileId) return setIsImage(src);

  //   try {
  //     if (!thumbId) return setIsImage('');

  //     // const res = await userApi.getUserDownloadAPI(thumbId);

  //     // setIsImage(res);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [isUserFileId, src, thumbId]);

  // useEffect(() => {
  //   getThumb();
  // }, [getThumb]);

  useEffect(() => {
    if (!src) return setIsImage('');

    setIsImage(src);
  }, [src]);

  return (
    <ProgressiveImage src={isImage} placeholder={placeholder}>
      {
        (thumb, loading) => (
          <img
            className={`image${loading ? ' loading' : ' loaded'}`}
            src={thumb}
            alt={alt}
            width={width}
            height={height}
            style={{ borderRadius: isCircle ? '50%' : '0' }}
            {...props}
          />
        )
        // isUserFileId ? (
        //   <img
        //     className={`image${loading ? ' loading' : ' loaded'}`}
        //     src={isImage || placeholder}
        //     alt={alt}
        //     width={width}
        //     height={height}
        //     style={{ borderRadius: isCircle ? '50%' : '0' }}
        //     {...props}
        //   />
        // ) : (
        //   <img
        //     className={`image${loading ? ' loading' : ' loaded'}`}
        //     src={thumb}
        //     alt={alt}
        //     width={width}
        //     height={height}
        //     style={{ borderRadius: isCircle ? '50%' : '0' }}
        //     {...props}
        //   />
        // )
      }
    </ProgressiveImage>
  );
};
