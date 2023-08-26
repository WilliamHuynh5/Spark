import { Box } from '@mui/material';
import React from 'react';

interface BannerWithAvatarProps {
  /**
   * The URL of the background image to be displayed in the banner.
   */
  backgroundImageSrc: string;
  /**
   * The height of the banner.
   */
  height?: number;
  /**
   * The width of the banner.
   */
  width?: number | string;
  /**
   * The maximum width of the banner.
   */
  maxWidth?: number | string;
  /**
   * The minimum width of the banner.
   */
  minWidth?: number | string;
}

/**
 * BannerWithAvatar component displays a banner with a background image.
 * It provides options to customize the height, width, maximum width, and minimum width of the banner.
 *
 * @param {BannerWithAvatarProps} props - The props for the component.
 * @param {string} props.backgroundImageSrc - The URL of the background image to be displayed in the banner.
 * @param {number} [props.height] - The height of the banner. Default is 350.
 * @param {number|string} [props.width] - The width of the banner. Default is '100%'.
 * @param {number|string} [props.maxWidth] - The maximum width of the banner. Default is '100%'.
 * @param {number|string} [props.minWidth] - The minimum width of the banner. Default is '100%'.
 * @returns {JSX.Element} - The JSX element representing the BannerWithAvatar component.
 */
const BannerWithAvatar = ({
  backgroundImageSrc,
  height = 350,
  width = '100%',
  maxWidth = '100%',
  minWidth = '100%',
}: BannerWithAvatarProps) => {
  return (
    <React.Fragment>
      <Box
        sx={{
          position: 'relative',
          width: `${width}`,
          maxWidth: '55%',
          height: `${height}px`,
          borderRadius: '10px',
          border: '1px solid #E0E0E0',
          background: `url('${backgroundImageSrc}')`,
          backgroundPosition: 'center',
          margin: 'auto',
          '@media (max-width: 2200px)': {
            flexDirection: 'column',
            minWidth: `${minWidth}`,
            maxWidth: `${maxWidth}`,
          },
        }}
      ></Box>
    </React.Fragment>
  );
};

export default BannerWithAvatar;
