import { useMediaQuery } from 'react-responsive';

const useResponsiveBreakpoint = () => {
    const isDesignBreakpoint = useMediaQuery({ query: '(max-width: 1150px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 535px)' });
    const isMediumDevice = useMediaQuery({ query: '(min-width: 450px) and (max-height: 700px)' });

  return { isDesignBreakpoint, isMobile, isMediumDevice };
};

export default useResponsiveBreakpoint;
