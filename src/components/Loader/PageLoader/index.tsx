// style
import { StyledPageLoader } from './style';

// consts
import { loadingData } from 'consts';

// libraries
import Lottie from "react-lottie";

interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PageLoader: React.FC<PageLoaderProps> = ({ className = 'page-loader' }) => {
  
  return (
    <StyledPageLoader className={className}>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: loadingData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={50}
        width={180}
        isClickToPauseDisabled={true}
      />
    </StyledPageLoader>
  );
};
