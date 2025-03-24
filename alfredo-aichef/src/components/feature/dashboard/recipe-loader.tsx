import { Box } from '@mui/material';

export const RecipeLoader = () => {
  const GenerateIconSvg =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z'/%3E%3C/svg%3E\")";
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="400px"
      width="100%"
    >
      <Box
        sx={{
          position: 'relative',
          width: 120,
          height: 120,
          animation: 'pulse-scale 3s infinite ease-in-out',
          '@keyframes pulse-scale': {
            '0%': {
              transform: 'scale(0.8)',
            },
            '50%': {
              transform: 'scale(1.2)',
            },
            '100%': {
              transform: 'scale(0.8)',
            },
          },
        }}
      >
        {/* This box acts as a container for our masked content */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* This is the skeleton animation background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: (theme) => theme.palette.action.disabledBackground,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                animation: 'shimmer 1.5s infinite',
              },
              '@keyframes shimmer': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' },
              },
              // This is the key - we mask this box with the icon shape
              WebkitMaskImage: GenerateIconSvg,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

// import { Box, BoxProps } from '@mui/material';

// type HOCsProps = {
//   children: React.ReactNode;
// } & BoxProps;

// const Container = ({ children }: HOCsProps) => {
//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         width: 120,
//         height: 120,
//         animation: 'pulse-scale 3s infinite ease-in-out',
//         '@keyframes pulse-scale': {
//           '0%': {
//             transform: 'scale(0.8)',
//           },
//           '50%': {
//             transform: 'scale(1.2)',
//           },
//           '100%': {
//             transform: 'scale(0.8)',
//           },
//         },
//       }}
//     >
//       {children}
//     </Box>
//   );
// };

// const Mask = ({ children }: HOCsProps) => {
//   return (
//     <Container>
//       <Box
//         sx={{
//           position: 'relative',
//           width: '100%',
//           height: '100%',
//           overflow: 'hidden',
//         }}
//       >
//         {children}
//       </Box>
//     </Container>
//   );
// };

// export const RecipeLoader = () => {
//   const GenerateIconSvg =
//     "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z'/%3E%3C/svg%3E\")";
//   return (
//     <Mask
//       sx={{
//         position: 'relative',
//         width: 120,
//         height: 120,
//         animation: 'pulse-scale 3s infinite ease-in-out',
//         '@keyframes pulse-scale': {
//           '0%': {
//             transform: 'scale(0.8)',
//           },
//           '50%': {
//             transform: 'scale(1.2)',
//           },
//           '100%': {
//             transform: 'scale(0.8)',
//           },
//         },
//       }}
//     >
//       {/* This is the skeleton animation background */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: (theme) => theme.palette.action.disabledBackground,
//           '&::after': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background:
//               'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
//             animation: 'shimmer 1.5s infinite',
//           },
//           '@keyframes shimmer': {
//             '0%': { transform: 'translateX(-100%)' },
//             '100%': { transform: 'translateX(100%)' },
//           },
//           // This is the key - we mask this box with the icon shape
//           WebkitMaskImage: GenerateIconSvg,
//           WebkitMaskSize: 'contain',
//           WebkitMaskRepeat: 'no-repeat',
//           WebkitMaskPosition: 'center',
//           maskSize: 'contain',
//           maskRepeat: 'no-repeat',
//           maskPosition: 'center',
//         }}
//       />
//     </Mask>
//   );
// };
